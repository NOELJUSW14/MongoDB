//Dependencies
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
//Setting-up Express-Handlebars
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultlayout: 'main' }))
app.set('view engine', 'handlebars')

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
})
