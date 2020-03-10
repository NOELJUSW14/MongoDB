<<<<<<< HEAD
// We'll be rewriting the table's data frequently, so let's make our code more DRY
// by writing a function that takes in 'comics' (JSON) and creates a table body
function displayResults(comics) {
  // First, empty the table
  $('tbody').empty()

  // Then, for each entry of that json...
  comics.forEach(function(comic) {
    // Append each of the comic's properties to the table
    var tr = $('<tr>').append(
      $('<td>').text(comic.title),
      $('<td>').text(comic.date),
      $('<td>').text(comic.link),
      $('<td>').text(comic._id),
    )

    $('tbody').append(tr)
  })
}

// Bonus function to change "active" header
function setActive(selector) {
  // remove and apply 'active' class to distinguish which column we sorted by
  $('th').removeClass('active')
  $(selector).addClass('active')
}

// 1: On Load
// ==========

// First thing: ask the back end for json with all comics
$.getJSON('/comics', function(data) {
  // Call our function to generate a table body
  displayResults(data)
})

// 2: Button Interactions
// ======================

// When user clicks the weight sort button, display table sorted by weight
$('#title-sort').on('click', function() {
  // Set new column as currently-sorted (active)
  setActive('#comic-title')

  // Do an api call to the back end for json with all animals sorted by weight
  $.getJSON('/title', function(data) {
    // Call our function to generate a table body
    displayResults(data)
  })
})

// When user clicks the name sort button, display the table sorted by name
$('#date-sort').on('click', function() {
  // Set new column as currently-sorted (active)
  setActive('#comic-date')

  // Do an api call to the back end for json with all animals sorted by name
  $.getJSON('/date', function(data) {
    // Call our function to generate a table body
    displayResults(data)
  })
=======
// Parses our HTML and helps us find elements
var cheerio = require('cheerio')
// Makes HTTP request for HTML page
var axios = require('axios')

// First, tell the console what server.js is doing
console.log(
  '\n***********************************\n' +
    'Grabbing every thread name and link\n' +
    "from reddit's webdev board:" +
    '\n***********************************\n',
)

// Making a request via axios for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
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
    var title = $(element)
      .find('a')
      .text()
      .split('  ')[0]

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(element)
      .children('a')
      .attr('href')

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link,
    })
  })

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results)
>>>>>>> c22ac4590cd439ee663a2a71d9e70adc12dff2da
})
