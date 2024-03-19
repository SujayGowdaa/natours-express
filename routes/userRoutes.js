const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController'); // Import controller functions
const { signup, login } = require('../controllers/authController');

const router = express.Router(); // Create a router instance

router.post('/signup', signup);
router.post('/login', login);

// Define routes and corresponding controller functions
router.route('/').get(getAllUsers).post(createUser); // Route to get all users or create a new user
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser); // Route to get, update, or delete a specific user

module.exports = router; // Export the router
