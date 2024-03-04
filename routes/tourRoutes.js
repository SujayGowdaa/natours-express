const express = require('express');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
  checkBody,
} = require('../controllers/tourController');

const router = express.Router();

router.param('id', checkId); // whenever the "id" param is present, only then this middleware runs

router.route('/').get(getAllTours).post(checkBody, createTour); // checkBody middleware run 1st and checks if the data is valid later runs createTour
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
