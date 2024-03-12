const express = require('express');
const {
  getTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getTourByMonth,
} = require('../controllers/tourController'); // Import controller functions

const router = express.Router(); // Create a router instance

// Define routes and corresponding controller functions
router.route('/top-5-tours').get(getTopTours, getAllTours); // Route to get top 5 tours
router.route('/tours-by-month/:year').get(getTourByMonth); // Route to get tours by month
router.route('/tours-stats').get(getTourStats); // Route to get tour statistics
router.route('/').get(getAllTours).post(createTour); // Route to get all tours or create a new tour
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour); // Route to get, update, or delete a specific tour

module.exports = router; // Export the router
