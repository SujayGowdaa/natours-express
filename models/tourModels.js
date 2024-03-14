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
    startDates: [Date], // Array of start dates for the
    secretTour: {
      type: Boolean,
      default: false,
    },
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

// Document Middlware:
// only runs for .save(), and.create() method, and it doesn't run on any other methods. It runs before saving new doc.
// These middleware functions are executed on specific document operations such as save, validate, remove, and init. They are defined using schema.pre() and schema.post() methods. Document middleware functions have access to the document being operated on (this) and can perform tasks like data validation, modification, or logging before or after the operation.

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

// Query Middleware
// Query middleware functions are executed before or after executing a query. They are defined using schema.pre() and schema.post() methods with the query hook as the first argument (e.g., find, findOne, updateOne). Query middleware functions have access to the query object and can modify the query parameters, perform logging, or execute additional logic.

tourSchema.pre(/^find/, function (next) {
  // when we use expression like this for eg: /^find/. This middleware runs for all the commands starts with find name for eg: findOne, findById etc...
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

// Aggregation Middleware
// Aggregate middleware functions allow interception of aggregate function calls. They are defined using schema.pre() and schema.post() methods with the aggregate hook. Aggregate middleware functions have access to the aggregation pipeline and can modify the pipeline stages, perform logging, or execute additional logic before or after aggregation.

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: {
      secretTour: {
        $ne: true,
      },
    },
  });
  console.log(this.pipeline());
  next();
});

// Create a Mongoose model based on the schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
