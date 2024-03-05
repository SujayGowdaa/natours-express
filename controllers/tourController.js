const Tour = require('../models/tourModels');

// Handling Requests
// Tours

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
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
      data: err.message,
    });
  }
};
const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id); // findyID is a short hand of findOne()
    // to make the same request using findOne() method = Tour.findOne({_id:req.params.id})
    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      data: err.message,
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
      data: newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      data: err.message,
    });
  }
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      data: 'Updated tour here...',
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: {
      data: null,
    },
  });
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
