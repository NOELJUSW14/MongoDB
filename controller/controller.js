<<<<<<< HEAD
var express = require('express')
var router = express.Router()
var path = require('path')
var axios = require('axios')

var cheerio = require('cheerio')

var Comment = require('../models/comments')
var Article = require('../models/article')

router.get('/', function(req, res) {
  res.redirect('/articles')
})

router.get('/scrape', function(req, res) {
  axios.get('https://arstechnica.com/gadgets/').then(function(response) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data)

    // An empty array to save the data that we'll scrape
    var results = []

    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $('li.article').each(function(i, element) {
      // Save the text of the element in a "title" variable
      results.title = $(element)
        .find('a')
        .text()
        .split('  ')[0]

      // In the currently selected element, look at its child elements (i.e., its a-tags),
      // then save the values for any "href" attributes that the child elements may have
      results.link = $(element)
        .children('a')
        .attr('href')

      if (result.title !== '' && result.link !== '') {
        if (results.indexOf(results.title) == -1) {
          results.push(results.title)

          Article.count({ title: result.title }, function(err, test) {
            if (test === 0) {
              var entry = new Article(result)

              entry.save(function(err, doc) {
                if (err) {
                  console.log(err)
                } else {
                  console.log(doc)
                }
              })
            }
          })
        } else {
          console.log('Article already exists.')
        }
      } else {
        console.log('Not saved to DB, missing data')
      }
    })
    res.redirect('/')
    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link,
    })
  })

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results)
})

router.get('/articles', function(req, res) {
  Article.find()
    .sort({ _id: -1 })
    .exec(function(err, doc) {
      if (err) {
        console.log(err)
      } else {
        var artcl = { article: doc }
        res.render('index', artcl)
      }
    })
})

router.get('/articles-json', function(req, res) {
  Article.find({}, function(err, doc) {
    if (err) {
      console.log(err)
    } else {
      res.json(doc)
    }
  })
})

router.get('/clearAll', function(req, res) {
  Article.remove({}, function(err, doc) {
    if (err) {
      console.log(err)
    } else {
      console.log('removed all articles')
    }
  })
  res.redirect('/articles-json')
})

router.get('/readArticle/:id', function(req, res) {
  var articleId = req.params.id
  var hbsObj = {
    article: [],
    body: [],
  }

  Article.findOne({ _id: articleId })
    .populate('comment')
    .exec(function(err, doc) {
      if (err) {
        console.log('Error: ' + err)
      } else {
        hbsObj.article = doc
        var link = doc.link
        request(link, function(error, response, html) {
          var $ = cheerio.load(html)

          $('.l-col__main').each(function(i, element) {
            hbsObj.body = $(this)
              .children('.c-entry-content')
              .children('p')
              .text()

            res.render('article', hbsObj)
            return false
          })
        })
      }
    })
})
router.post('/comment/:id', function(req, res) {
  var user = req.body.name
  var content = req.body.comment
  var articleId = req.params.id

  var commentObj = {
    name: user,
    body: content,
  }

  var newComment = new Comment(commentObj)

  newComment.save(function(err, doc) {
    if (err) {
      console.log(err)
    } else {
      console.log(doc._id)
      console.log(articleId)

      Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comment: doc._id } },
        { new: true },
      ).exec(function(err, doc) {
        if (err) {
          console.log(err)
        } else {
          res.redirect('/readArticle/' + articleId)
        }
      })
    }
  })
})

=======
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

>>>>>>> c22ac4590cd439ee663a2a71d9e70adc12dff2da
module.exports = router
