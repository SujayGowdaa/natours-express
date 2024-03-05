const Tour = require('../models/tourModels');

// Handling Requests
// Tours

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};
const getTour = (req, res) => {
  // const tour = tours.find((el) => el.id === Number(req.params.id));
  res.status(200).json({
    status: 'success',
    // data: tour,
  });
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
