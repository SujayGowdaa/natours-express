const mongoose = require('mongoose');

// Define a Mongoose schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour mush have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// Create a Mongoose model based on the schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
