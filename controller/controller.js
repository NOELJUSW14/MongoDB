const express = require('express')
const router = express.Router()
const axios = require('axios')
const cheerio = require('cheerio')

// Initialize Express
var app = express()
// Database configuration
// Save the URL of our database as well as the name of our collection
const Comments = require('../models/comments')
const Article = require('../models/article')

// db.on('error', function(error) {
//   console.log('Database Error:', error)
// })

// Root: Displays a simple "Hello World" message (no mongo required)
app.get('/', function(req, res) {
  res.send('Welcome to Comics Scraper')
})

// All: Send JSON response with all animals
app.get('/all', function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything
  Article.find({}, function(err, data) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err)
    } else {
      // Otherwise, send the result of this query to the browser
      res.json(data)
    }
  })
})
// TODO: Implement the remaining two routes
//At the "/name" path, display every entry in the animals collection, sorted by name
app.get('/article', function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything,
  // but this time, sort it by name (1 means ascending order)
  Article.find().sort({ title: -1 }, function(err, found) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err)
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found)
    }
  })
})

// 4. At the "/weight" path, display every entry in the animals collection, sorted by weight
app.get('/date', function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything,
  // but this time, sort it by weight (-1 means descending order)
  Article.find().sort({ date: -1 }, function(err, found) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err)
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found)
    }
  })
})

// 1: Name: Send JSON response sorted by name in ascending order, e.g. GET "/name"

// 2: Weight: Send JSON response sorted by weight in descending order, , e.g. GET "/weight"
// First, tell the console what server3.js is doing
console.log(
  '\n******************************************\n' +
    'Look at the image of every award winner in \n' +
    'one of the pages of `awwwards.com`. Then,\n' +
    "grab the image's source URL." +
    '\n******************************************\n',
)

app.get('/scrape', function(req, res) {
  // Making a request via axios for "https://comics.azcentral.com/" Garfields Page
  axios
    .get('https://comics.azcentral.com/slideshow?comic=ga')
    .then(function(response) {
      // Load the body of the HTML into cheerio
      var $ = cheerio.load(response.data)

      // Empty array to save our scraped data
      var results = []

      // With cheerio, find each div-tag with the class "comics-wrapper" and loop through the results
      $('.comics-wrapper').each(function(i, element) {
        // Save the text of the div-tag with class comic-display-name, span- tag with class "comic-name" as "title"
        var title = $(element)
          .find('.comic-display-name')
          .find('.comic-name')
          .text()
        // Save the text of the div-tag with class comic-display-name, span-tag with class "comic-date-r" as "date"
        var date = $(element)
          .find('.comic-display-name')
          .find('.comic-date-r')
          .text()

        // Find the img-tag's, and save it's attr "src" as "link"
        var link = $(element)
          .find('img')
          .attr('src')

        // If this found element had both a title and a link
        if (title && date && link) {
          // Insert the data in the Comics db
          db.comics.insert({
            title: title,
            date: date,
            link: link,
          }),
            function(err, inserted) {
              if (err) {
                // Log the error if one is encountered during the query
                console.log(err)
              } else {
                // Otherwise, log the inserted data
                console.log(inserted)
              }
            }
        }
      })
    })
  // Send a "Scrape Complete" message to the browser
  res.send('Scrape Complete')
})

// // Make an object with data we scraped for this div and push it to the results array
//       results.push({
//         title: title,
//         date: date,
//         link: link,
//       })
//     })

//     // After looping through each div.comics-wrapper, log the results
//     console.log(results)
//   })

module.exports = router
