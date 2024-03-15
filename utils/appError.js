class AppError extends Error {
  constructor(message, statusCode) {
    super(); // If you don't call super() in the constructor of the child class, you'll encounter a reference error, as the this keyword will not be initialized properly, and you won't be able to access properties or methods inherited from the parent class.
    this.message = message;
    this.statusCode = statusCode;
    this.status = toString(statusCode).startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
