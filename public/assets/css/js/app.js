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
$.getJSON('/all', function(data) {
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
})
