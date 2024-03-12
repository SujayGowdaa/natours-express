const Tour = require('../models/tourModels');
const APIFeatures = require('../utils/apiFeature');

// Handling Requests
// Top tours

const getTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

// Tours
const getAllTours = async (req, res) => {
  try {
    // executing query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const tours = await features.query;

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

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      [
        // Stage 1: Match documents with ratingAverage >= 4.5
        {
          $match: { ratingAverage: { $gte: 4.5 } },
        },
        // Stage 2: Group documents by the uppercased difficulty field and calculate statistics
        {
          $group: {
            _id: { $toUpper: '$difficulty' }, // Group by the uppercased difficulty
            numTours: { $sum: 1 }, // Count the number of tours in each group
            numRatings: { $sum: '$ratingQuantity' }, // Sum the rating quantities in each group
            avgRating: { $avg: '$ratingAverage' }, // Calculate the average rating in each group
            avgPrice: { $avg: '$price' }, // Calculate the average price in each group
            maxPrice: { $max: '$price' }, // Find the maximum price in each group
            minPrice: { $min: '$price' }, // Find the minimum price in each group
          },
        },
        // Stage 3: Sort documents by avgPrice in descending order
        {
          $sort: { avgPrice: -1 }, // Sort by avgPrice in descending order
        },
        // // Stage 4: Match documents where _id is not 'EASY'
        // {
        //   $match: { _id: { $ne: 'EASY' } }, // Exclude documents with _id 'EASY'
        // },
      ],
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
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
  getTourStats,
};
