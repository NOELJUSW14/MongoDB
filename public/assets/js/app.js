$(function() {
  // Grab the Comics as a json
  // $.getJSON('/comics', data => {
  //   // For each one
  //   for (var i = 0; i < data.length; i++) {
  //     // Display the apropos information on the page
  //     $('#comics').append(
  //       "<p comic-id='" +
  //         data[i]._id +
  //         "'>" +
  //         data[i].title +
  //         'by' +
  //         data[i].author +
  //         '<br />' +
  //         data[i].link +
  //         '</p>',
  //     )
  //   }
  // })

  // Whenever someone clicks a p tag
  $(document).on('click', 'p', function() {
    // Empty the notes from the note section
    $('#comments').empty()
    // Save the id from the p tag
    var thisId = $(this).attr('data-id')

    // Now make an ajax call for the Comments
    $.ajax({
      method: 'GET',
      url: '/comments/' + thisId,
    })
      // With that done, add the note information to the page
      .then(data => {
        console.log(data)
        // The title of the article
        $('#comments').append('<h2>' + data.title + '</h2>')
        // An input to enter a new title
        $('#comments').append("<input id='titleinput' name='title' >")
        // A textarea to add a new note body
        $('#comments').append(
          "<textarea id='bodyinput' name='body'></textarea>",
        )
        // A button to submit a new note, with the id of the article saved to it
        $('#comments').append(
          "<button data-id='" + data._id + "' id='savenote'>Save Note</button>",
        )

        // If there's a note in the article
        if (data.comments) {
          // Place the title of the note in the title input
          $('#titleinput').val(data.comments.title)
          // Place the body of the note in the body textarea
          $('#bodyinput').val(data.comments.body)
        }
      })
  })

  // When you click the savenote button
  $(document).on('click', '#savenote', function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr('data-id')

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: 'POST',
      url: '/comics/' + thisId,
      data: {
        // Value taken from title input
        title: $('#titleinput').val(),
        // Value taken from note textarea
        body: $('#bodyinput').val(),
      },
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data)
        // Empty the notes section
        $('#comments').empty()
      })

    // Also, remove the values entered in the input and textarea for note entry
    $('#titleinput').val('')
    $('#bodyinput').val('')
  })

  
})
