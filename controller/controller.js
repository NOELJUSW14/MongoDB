const express = require('express')
const router = express.Router()
const axios = require('axios')
const cheerio = require('cheerio')

// Import the model to use its database functions.
const db = require('../models')

// Create all our routes and set up logic within those routes where required.
router.get('/', function(req, res) {
  res.redirect('/scrape')
})

router.get('/scrape', function(req, res) {
  axios.get('https://www.gocomics.com/comics/a-to-z').then(function(response) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data)

    // An empty array to save the data that we'll scrape
    var comicsResults = []

    $('.gc-blended-link').each(function(i, element) {
      var dateArray = []
      var results = {}
      // Add the text and href of every link, and save them as properties of the result object
      results.title = $(this)
        .find('h4')
        .text()
      results.author = $(this)
        //put exact id
        .find('.media-subheading')
        .text()
      results.link = $(this).attr('href')
      dateArray = results.link.split('/').slice(-3)
      results.date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
      axios.get('https://www.gocomics.com/'+ results.link).then(function(response) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data)
    results.image = $('.comic__image').find(".img-fluid").attr("src")
      })
      // Create a new Article using the `results` object built from scraping
      db.Comics.create(results)
        .then(function(dbComics) {
          // View the added result in the console
          console.log(dbComics)
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err)
        })
      // console.log(results)
    })
    res.redirect('/comics')
  })
})

// Route for retrieving all Comics from the db
router.get('/comics', function(req, res) {
  // Find all Comics
  db.Comics.find({})
    .then(function(dbComics) {
      // If all Comics are successfully found, send them back to the client
      res.json(dbComics)
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err)
    })
})

// Route for grabbing a specific Comic by id, populate it with it's comments
router.get('/comics/:id', function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Comics.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate('comments')
    .then(function(dbComics) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbComics)
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err)
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
