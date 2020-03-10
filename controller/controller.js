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

module.exports = router
