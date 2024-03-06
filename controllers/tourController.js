const Tour = require('../models/tourModels');

// Handling Requests
// Tours

const getAllTours = async (req, res) => {
  try {
    // filters
    const { page, limit, sort, ...rest } = { ...req.query };

    // advanced filters
    let queryObj = req.query;
    // Convert the JavaScript object `queryObj` into a JSON string representation
    // This is done to manipulate the query as a string
    queryObj = JSON.stringify(queryObj).replace(
      // Regular expression pattern to match shorthand query operators as whole words
      /\b(gt|gte|lt|lte)\b/g,
      // Callback function to replace matched words with MongoDB query operators
      (match) => `$${match}`,
    );
    console.log(queryObj);
    const query = Tour.find(JSON.parse(queryObj)); // passing filters
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
      message: err,
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
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
