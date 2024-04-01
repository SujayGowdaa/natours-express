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
    select: false,
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
  passwordChangedAt: Date,
});

// Salting: Salting is the process of adding random data (called a salt) to the input before it is hashed. The salt is typically a random string of characters unique to each password. By adding a salt to each password before hashing, even if two users have the same password, their hashed values will be different because of the unique salt.

// Hashing: Hashing is the process of converting an input (such as a password) into a fixed-size string of characters using a cryptographic hash function. The resulting hash is unique to the input, meaning that even small changes in the input will produce drastically different hash values.

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

// Define a custom instance method `checkPassword` on the user schema
userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword,
) {
  // Use bcrypt.compare to compare the candidate password with the hashed user password
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Check if the user has changed their password after a given timestamp.
 * @param {number} JWTTimestamp The timestamp from the JWT token.
 * @returns {boolean} Returns true if the password was changed after the provided timestamp, false otherwise.
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // Check if the user's password has been changed
  if (this.passwordChangedAt) {
    // Convert the passwordChangedAt timestamp to seconds
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    // Compare the JWT timestamp with the password changed timestamp
    return JWTTimestamp < changedTimestamp;
  }
  // Return


const User = mongoose.model('User', userSchema);
module.exports = User;
