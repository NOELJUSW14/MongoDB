//Dependencies
<<<<<<< HEAD
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var logger = require('morgan')

//initialize Express app
var express = require('express')
var app = express()

app.use(logger('dev'))
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
=======
const logger = require('morgan')
const mongoose = require('mongoose')

// Initialize Express
const express = require('express')
const app = express()

// Use morgan logger for logging requests
app.use(logger('dev'))
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Make public a static folder
app.use(express.static('public'))

>>>>>>> c22ac4590cd439ee663a2a71d9e70adc12dff2da
//Setting-up Express-Handlebars
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultlayout: 'main' }))
app.set('view engine', 'handlebars')

<<<<<<< HEAD
app.use(express.static(process.cwd() + '/public'))

//connecting to MongoDB
//mongoose.connect("mongodb://localhost/scraped_news");
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/ArticleScraper'
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('Connected to Mongoose!')
})

var routes = require('./controller/controller.js')
app.use('/', routes)
//Create localhost port
var port = process.env.PORT || 3000
app.listen(port, function() {
  console.log('Listening on PORT ' + port)
=======
//connect to the port
const port = process.env.PORT || 3000

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/ComicScraper'
mongoose.connect(MONGODB_URI)
var link = mongoose.connection
link.on('error', console.error.bind(console, 'connection error:'))
link.once('open', function() {
  console.log('Connected to Database!')
})

//connect to the port
app.listen(port, function() {
  console.log('Listening on PORT ' + port + '!')
>>>>>>> c22ac4590cd439ee663a2a71d9e70adc12dff2da
})
