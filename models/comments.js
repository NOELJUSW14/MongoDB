var mongoose = require('mongoose')

// Save a reference to the Schema constructor
var Schema = mongoose.Schema

// Using the Schema constructor, create a new Character Schema object

// This is similar to a Sequelize model
var CommentsSchema = new Schema({
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
var Comments = mongoose.model('Comments', CommentsSchema)

// Export the Comics model
module.exports = Comments
