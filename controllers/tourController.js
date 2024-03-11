/* eslint-disable no-unused-vars */
/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../models/tourModels');

const getTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

// Handling Requests
// Tours
const getAllTours = async (req, res) => {
  try {
    // 1a. filters
    const { fields, page = 1, limit = 3, sort, ...rest } = { ...req.query };

    // 1b. advanced filters
    let queryObj = rest;
    // Convert the JavaScript object `queryObj` into a JSON string representation
    // This is done to manipulate the query as a string
    queryObj = JSON.stringify(queryObj).replace(
      // Regular expression pattern to match shorthand query operators as whole words
      /\b(gt|gte|lt|lte)\b/g,
      // Callback function to replace matched words with MongoDB query operators
      (match) => `$${match}`,
    );

    // 2. sorting
    // const tours = await Tour.find(JSON.parse(queryObj)).sort(req.query.sort);
    const query = Tour.find(JSON.parse(queryObj));
    if (req.query.sort) {
      const sortBy = req.query.sort.replace(/,/g, ' '); // replace method replaces comma with ' '
      query.sort(sortBy);
    } else {
      query.sort({ maxGroupSize: 1 });
    }

    // 3. field limiting - we can limit the properties shown to the user
    if (req.query.fields) {
      // if this is true only the properties which matches with the params will be shown
      query.select(fields.replace(/,/g, ' '));
    } else {
      // if this is false all the properties will be shown, but since we have used minus operator "-" in the beginning of the key value this will be considered as show all the properties except the one which is included in an array.
      // we can pass mutiple arguments in an array else just send string
      query.select('-__v'); //
    }

    // 4. pagination
    const skip = (Number(page) - 1) * Number(limit);
    query.skip(skip).limit(limit);

    if (req.query.page) {
      const numOfTours = await Tour.countDocuments();
      if (skip >= numOfTours) throw new Error('No more data');
    }

    // executing query
    const tours = await query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id); // findyID is a short hand of findOne()
    // to make the same request using findOne() method = Tour.findOne({_id:req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const createTour = async (req, res) => {
  // 2 ways to create data
  // const newTour = new Tour({});
  // newTour.save();

  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document after the update operation
      runValidators: true, // Run validators (specified in the schema) on the updated data
    });
    res.status(200).json({
      status: 'success',
      data: {
        data: {
          updatedTour,
        },
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        data: null,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

module.exports = {
  getTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
