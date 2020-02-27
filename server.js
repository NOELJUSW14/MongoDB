//Dependencies
const logger = require('morgan')
const mongoose = require('mongoose')
const axios = require('axios')
const cheerio = require('cheerio')
const routes = require('./controller/controller')
// Initialize Express
const express = require('express')
const app = express()

// Use morgan logger for logging requests
app.use(logger('dev'))
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(routes)

// Make public a static folder
app.use(express.static('public'))

//Setting-up Express-Handlebars
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultlayout: 'main' }))
app.set('view engine', 'handlebars')

//Models
// const Comment = require("./models/comments");
// const Comics = require("./models/comics")
const db = require('./models')

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
  console.log('Listening on PORT ' + port +"!")
})
