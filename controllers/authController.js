const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    // Generate a JWT token for the newly registered user
    const token = jwt.sign(
      // Payload: Include the user's ID in the token
      { id: newUser._id },
      // Secret key used to sign the token, retrieved from environment variables
      process.env.JWT_SECRET,
      {
        // Options object:
        expiresIn: process.env.JWT_EXPIRES_IN, // Set the expiration time for the token, retrieved from environment variables
      },
    );

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

module.exports = {
  signup,
};
