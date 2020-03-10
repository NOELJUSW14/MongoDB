var mongoose = require('mongoose')

// Save a reference to the Schema constructor
var Schema = mongoose.Schema

// Using the Schema constructor, create a new Character Schema object

// This is similar to a Sequelize model
<<<<<<< HEAD
var CommentsSchema = new Schema({
=======
var CommentSchema = new Schema({
>>>>>>> c22ac4590cd439ee663a2a71d9e70adc12dff2da
  // `title` must be of type String
  name: {
    type: String,
  },
  body: {
    type: String,
    required: true,
  },
})

// This creates our model from the above schema, using mongoose's model method
<<<<<<< HEAD
var Comments = mongoose.model('Comments', CommentsSchema)

// Export the Comics model
module.exports = Comments
=======
var Comment = mongoose.model('Comment', CommentSchema)

// Export the Comics model
module.exports = Comment
>>>>>>> c22ac4590cd439ee663a2a71d9e70adc12dff2da
