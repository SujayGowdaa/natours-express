const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value (${err.keyValue.name}). Please use different value`;
  return new AppError(message, 400);
};

const handleValidationDB = (err) => {
  const msg = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${msg.join('. ')}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () => {
  const message = 'Invalid token. Please login again';
  return new AppError(message, 401);
};

const handleTokenExpiredError = () => {
  const message = 'Token expired login again!';
  return new AppError(message, 401);
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to the client
  if (err.isOperational) {
    // Send error response with the appropriate status code and error message
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Program or any other unknown error: don't leak error details
  } else {
    // 1. log error
    // eslint-disable-next-line
    console.error('Error 💥: ', err);

    // 2. send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went really wrong',
    });
  }
};

// eslint-disable-next-line arrow-body-style
const sendErrorDev = (err, res) => {
  // Send error response with the appropriate status code and error message
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Middleware function to handle errors globally. Express with four arguments will automatically recognizes it as an error handling middleware.So it only be called if there is an error.
// Global error handling middleware for Express applications
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Check if the environment is set to development
  if (process.env.NODE_ENV === 'development') {
    // Send detailed error information in the development environment
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // Create a copy of the error object and set its name property to the constructor name
    let error = { ...err, name: err.constructor.name };

    // Check if the error is a CastError (e.g., invalid MongoDB ObjectId)
    // Handle CastError for MongoDB ObjectId
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    // Handle Duplicate value for MongoDB
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    // Handle Validation error of MongoDB schema
    if (error.name === 'ValidationError') error = handleValidationDB(error);

    if (error.name === 'JsonWebTokenError')
      error = handleJsonWebTokenError(error);

    if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredError(error);

    // Send concise error information in the production environment
    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
