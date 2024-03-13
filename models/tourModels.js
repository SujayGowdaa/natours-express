const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

// Define a Mongoose schema for tours
const tourSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, unique: false }, // Tour name
    slug: {
      type: String,
    },
    duration: { type: Number, required: [true, 'A tour must have a duration'] }, // Duration of the tour in days
    maxGroupSize: {
      // Maximum group size for the tour
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      // Difficulty level of the tour
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingAverage: {
      // Average rating of the tour
      type: Number,
      default: 4.5,
    },
    ratingQuantity: {
      // Number of ratings for the tour
      type: Number,
      default: 0,
    },
    priceDiscount: Number, // Discounted price for the tour
    summary: {
      // Summary description of the tour
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    imageCover: {
      // Cover image for the tour
      type: String,
      required: [true, 'A tour must have an image'],
    },
    images: [String], // Array of images for the tour
    createdAt: { type: Date, default: Date.now(), select: false }, // Date and time when the tour was created
    description: {
      // Detailed description of the tour
      type: String,
      trim: true,
    },
    rating: Number, // Overall rating of the tour
    price: { type: Number, require: true, unique: false, default: 2000 }, // Price of the tour
    startDates: [Date], // Array of start dates for the tour
  },
  {
    toJSON: { virtuals: true }, // Include virtual properties when converting to JSON
    toObject: { virtuals: true }, // Include virtual properties when converting to a regular JavaScript object
    strict: true, // Strict mode is enabled to enforce the schema
    id: false,
  },
);

// Define a virtual property for durationWeeks
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7; // Calculate duration in weeks
});

// Document Middlware: only works for .save(), and .create() method, and it doesn't run on any other methods. It runs before saving new doc
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); // To generate a slug for the tour before saving
  // console.log('saving document step 1');
  next(); // Calls the next middleware in the middleware chain
});

// // It runs before saving new doc but only after previous middleware in the stack
// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   console.log('saving document step 2');
//   next(); // Calls the next middleware in the middleware chain
// });

// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next(); // Calls the next middleware in the middleware chain
// });

// Create a Mongoose model based on the schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
