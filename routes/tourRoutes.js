const express = require('express');
const {
  getTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

const router = express.Router();

router.route('/top-5-tours').get(getTopTours, getAllTours);
router.route('/').get(getAllTours).post(createTour); // checkBody middleware run 1st and checks if the data is valid later runs createTour
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
