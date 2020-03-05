const express = require('express')
const router = express.Router()
const axios = require('axios')
const cheerio = require('cheerio')

// Import the model to use its database functions.
const db = require('../models')

// Create all our routes and set up logic within those routes where required.

// Route for retrieving all Comics from the db
router.get('/', (req, res) => {
  // Find all Comics
  console.log("hello")
  db.Comics.find({}).exec((err, data) => {
    console.log(data)
    if (err) {
      res.send(err)
    } else {
      var comicObj = {
        Comics: data,
      }
      res.render('index', comicObj)
    }
  })
})

router.get('/scrape', function(req, res) {
  // Making a request
  var siteReq = axios.get('https://www.gocomics.com/comics/a-to-z')
  siteReq.then(res => {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    const $ = cheerio.load(res.data)

    // An empty array to save the data that we'll scrape
    var comicsResults = []

    $('.gc-blended-link').each((i, element) => {
      var dateArray = []
      var results = {}
      // Add the text and href of every link, and save them as properties of the result object
      results.title = $(element)
        .find('h4')
        .text()
      results.author = $(element)
        //put exact id
        .find('.media-subheading')
        .text()
      results.link = $(element).attr('href')

      //dateArray = results.link.split('/').slice(-3);
      //date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
      //find the image of comic strip
      //axios.get('https://www.gocomics.com/'+ link).then(response => {
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      //var $ = cheerio.load(response.data);
      //var imageRes = {};
      //const image = $('.comic__image').find(".img-fluid").attr("src")
      //image.each(i, element)
    })
    // Create a new Article using the `results` object built from scraping
    db.Comics.create(results)
      .then(dbComics => {
        // View the added result in the console
        console.log(dbComics + '`\n`--------------')
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err)
      })
    // console.log(results)
  })

  res.redirect('/')
})

// Route for grabbing a specific Comic by id, populate it with it's comments
router.get('/comics/:id', function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Comics.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate('comments')
    .exec((err, doc) => {
      if (err) {
        console.log(err)
      } else {
        var commentsObj = {
          Comics: doc,
        }
        console.log(commentsObj)
        res.render('comments', commentsObj)
      }
    })
})

// Route for saving/updating an Article's associated Note
router.post('/comics/:id', function(req, res) {
  // Create a new note and pass the req.body to the entry
  Comment.create(req.body)
    .then(function(dbComment) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return Comics.findOneAndUpdate(
        { _id: req.params.id },
        { comments: dbComment._id },
        { new: true },
      )
    })
    .then(function(dbComment) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbComment)
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err)
    })
})
module.exports = router
