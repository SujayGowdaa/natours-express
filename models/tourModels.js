const mongoose = require('mongoose');

// Define a Mongoose schema
const tourSchema = new mongoose.Schema({
  name: { type: String, require: true, unique: false },
  duration: { type: Number, required: [true, 'A tour must have a duration'] },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary'],
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a image'],
  },
  images: [String],
  createdAt: { type: Date, default: Date.now() },
  description: {
    type: String,
    trim: true,
  },

  rating: Number,
  Price: { type: Number, require: true, unique: false, default: 2000 },
  startDates: [Date],
});

// Create a Mongoose model based on the schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
