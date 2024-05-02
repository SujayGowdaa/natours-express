const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

const getToken = function (id) {
  return jwt.sign(
    // Payload: Include the user's ID in the token
    { id },
    // Secret key used to sign the token, retrieved from environment variables
    process.env.JWT_SECRET,
    {
      // Options object:
      expiresIn: process.env.JWT_EXPIRES_IN, // Set the expiration time for the token, retrieved from environment variables
    },
  );
};

const signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });

    // Generate a JWT token for the newly registered user
    const token = getToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password) {
    // If either email or password is missing, return an error using the AppError middleware
    return next(new AppError('Please provide email and password'));
  }

  // 2. Check if user exists && password is correct
  // Find the user in the database by email, and explicitly returning a password field by default it is not returned because select: false
  const user = await User.findOne({ email }).select('+password');

  // If no user is found or the password is incorrect, return an error using the AppError middleware
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Invalid credentials', 401));
  }

  // 3. If everything is OK, send token to client
  // Generate a token for the authenticated user
  const token = getToken(user._id);

  // Send the token as a response to the client
  res.status(200).json({
    status: 'success',
    token,
  });
};

const protect = async (req, res, next) => {
  try {
    // 1. Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // If the request header contains an authorization token starting with 'Bearer',
      // extract the token from the header
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token is found, return an error using the AppError middleware with a status code of 401 (Unauthorized)
    if (!token) {
      return next(new AppError('Please log in to get access!', 401));
    }

    // 2. Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exits.',
          401,
        ),
      );
    }

    // 4. Check if user changed password after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed the password. Please login again.',
          401,
        ),
      );
    }

    req.user = freshUser;
    next();
    // If the token is valid and all checks pass, call the next middleware function
  } catch (err) {
    next(err);
  }
};

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };

module.exports = {
  signup,
  login,
  protect,
  restrictTo,
};
