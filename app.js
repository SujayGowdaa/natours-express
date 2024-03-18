const express = require('express');
const morgan = require('morgan');

const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express(); // the "app" module refers to the instance of the Express application. It is the central part of an Express application and is created by calling the express() function, which is exported by the Express module

// app.use() is a method used to mount middleware functions on the Express application. Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application's request-response cycle. They can perform tasks such as modifying request and response objects, executing code, and terminating the request-response cycle.

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

// Define a catch-all route handler using app.all() to handle requests for all routes
app.all('*', (req, res, next) => {
  /*
  const err = new Error(`Can't find ${req.originalUrl} on this server`); // whatever valur we pass inside Error("") will become the error message
  err.status = 'fail'; // Set the error status to 'fail' to indicate a failure
  err.statusCode = 404; // Set the HTTP status code of the error response to 404 (Not Found)
  next(err); // Call the error-handling middleware to handle the error with an error object
  // Important: when we pass an arguments to next(err) doesn't matter whatever it is, express will automatically know its an error and skips all other middleware functions in the stack and executes global error handling middleware.
*/
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app; // Export the Express application
