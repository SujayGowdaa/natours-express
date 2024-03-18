const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  phone: {
    type: Number,
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on creating of the doc! for eg: Model.create(), Model.save()
      validator: function (val) {
        return this.password === val;
      },
      message: 'Password not matching',
    },
  },
});

// Middleware function to hash the password before saving the user document
userSchema.pre('save', async function (next) {
  // Check if the password field has been modified
  if (!this.isModified('password')) return next();

  // Hash the password using bcrypt with a salt factor of 1 (for testing purposes)
  this.password = await bcrypt.hash(this.password, 10);

  // Remove the passwordConfirm field from the document after hashing
  this.passwordConfirm = undefined;

  // Proceed to the next middleware in the stack
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
