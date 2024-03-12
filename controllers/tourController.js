const Tour = require('../models/tourModels'); // Import the Tour model
const APIFeatures = require('../utils/apiFeature'); // Import the APIFeatures utility

// Middleware to get top tours
const getTopTours = (req, res, next) => {
  // Set query parameters to get top tours
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next(); // Call the next middleware
};

// Controller function to get all tours
const getAllTours = async (req, res) => {
  try {
    // Execute query using APIFeatures utility
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const tours = await features.query; // Await the query execution

    // Send response with tours data
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    // Handle error if query fails
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Controller function to get a single tour by ID
const getTour = async (req, res) => {
  try {
    // Find tour by ID
    const tour = await Tour.findById(req.params.id);
    // Send response with tour data
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    // Handle error if tour is not found
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// Controller function to create a new tour
const createTour = async (req, res) => {
  try {
    // Create new tour
    const newTour = await Tour.create(req.body);
    // Send response with new tour data
    res.status(201).json({
      status: 'success',
      data: {
        newTour,
      },
    });
  } catch (err) {
    // Handle error if creation fails
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Controller function to update a tour by ID
const updateTour = async (req, res) => {
  try {
    // Update tour by ID
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return updated document after update operation
      runValidators: true, // Run validators on updated data
    });
    // Send response with updated tour data
    res.status(200).json({
      status: 'success',
      data: {
        updatedTour,
      },
    });
  } catch (err) {
    // Handle error if update fails
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Controller function to delete a tour by ID
const deleteTour = async (req, res) => {
  try {
    // Delete tour by ID
    await Tour.findByIdAndDelete(req.params.id);
    // Send response with success message
    res.status(204).json({
      status: 'success',
      data: {
        data: null,
      },
    });
  } catch (err) {
    // Handle error if deletion fails
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Controller function to get tour statistics
const getTourStats = async (req, res) => {
  try {
    // Aggregate tour data to get statistics
    const stats = await Tour.aggregate([
      // Stage 1: Match documents with ratingAverage >= 4.5
      {
        $match: { ratingAverage: { $gte: 4.5 } },
      },
      // Stage 2: Group documents by the uppercased difficulty field and calculate statistics
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingQuantity' },
          avgRating: { $avg: '$ratingAverage' },
          avgPrice: { $avg: '$price' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
        },
      },
      // Stage 3: Sort documents by avgPrice in descending order
      {
        $sort: { avgPrice: -1 },
      },
    ]);

    // Send response with statistics data
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    // Handle error if aggregation fails
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Controller function to get tours by month
const getTourByMonth = async (req, res) => {
  try {
    const year = Number(req.params.year);

    const tours = await Tour.aggregate([
      // Unwind the startDates array to create a document for each date
      {
        $unwind: '$startDates',
      },

      // Match documents with startDates within the specified year
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      // Group documents by month, counting the number of tours and pushing tour names into an array
      {
        $group: {
          _id: { $month: '$startDates' }, // Extract month from startDates
          numOfTours: { $sum: 1 }, // Count number of tours
          tours: { $push: '$name' }, // Push tour names into an array
        },
      },

      // Sort the results by month in ascending order
      {
        $sort: { _id: 1 },
      },

      // Add a new field 'month' based on the month number
      {
        $addFields: {
          month: {
            $arrayElemAt: [
              [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
              ],
              { $subtract: ['$_id', 1] }, // Subtract 1 to match array index (January is at index 0)
            ],
          },

          durationWeeks: '$durationWeeks', // Access the virtual field in the aggregation pipeline
        },
      },

      // Project stage to exclude the '_id' field
      {
        $project: { _id: 0 },
      },

      // // Limit stage to limit the results to 6 documents
      // {
      //   $limit: 6,
      // },

      // {
      //   $sort: { numOfTours: -1 }, // When you apply two $sort aggregation stages in MongoDB aggregation pipeline, the last $sort stage will be used to sort the final output.
      // },
    ]);

    res.status(200).json([
      {
        status: 'success',
        results: tours.length,
        data: {
          tours,
        },
      },
    ]);
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
  getTourByMonth,
};
