const express = require('express');
const morgan = require('morgan');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express(); // Initialize Express application

// Middlewares
if (process.env.NODE_ENV === 'development') {
  // Check if environment is development
  app.use(morgan('dev')); // Use Morgan logger in development mode
}

app.use(express.json()); // Parse incoming request body as JSON
app.use(express.static(`${__dirname}/public/`)); // Serve static files from the 'public' directory

// Define routes
app.use('/api/v1/tours', tourRoutes); // Use tour routes for requests starting with '/api/v1/tours'
app.use('/api/v1/users', userRoutes); // Use user routes for requests starting with '/api/v1/users'

module.exports = app; // Export the Express application
