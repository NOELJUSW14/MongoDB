var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new Character Schema object

// This is similar to a Sequelize model
var ComicsSchema = new Schema({
  // `title` must be of type String
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
  },
  date: {
    type: String,
    required: true
  },
  image: {
    type: Array
  },
  comment:[
    {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var Comics = mongoose.model("Comics", ComicsSchema);

// Export the Comics model
module.exports = Comics;