const express = require('express');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

const router = express.Router();

router.route('/').get(getAllTours).post(createTour); // checkBody middleware run 1st and checks if the data is valid later runs createTour
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
