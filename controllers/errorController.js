// Middleware function to handle errors globally. Express with four arguments will automatically recognizes it as an error handling middleware. So it only be called if there is an error.
const globalErrorHandler = (err, req, res, next) => {
  // Set status code to the error's statusCode property, or 500 (Internal Server Error) if not provided
  err.statusCode = err.statusCode || 500;

  // Set status to the error's status property, or 'error' if not provided
  err.status = err.status || 'error';

  // Send error response with the appropriate status code and error message
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    isOperational: err.isOperational,
  });
};

module.exports = globalErrorHandler;
