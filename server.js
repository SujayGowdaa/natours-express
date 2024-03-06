// Import required modules
const dotenv = require('dotenv'); // dotenv for environment variables, call before importing other modules ensures that environment variables are properly set up and available for use throughout the application.
// Load environment variables from config file
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose'); // Mongoose for MongoDB
const app = require('./app'); // Custom application module

// Replace the placeholder in the database connection string with the actual password
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Connect to the MongoDB database
mongoose
  .connect(DB) // Connect to the database using the connection string
  .then(() => console.log('DB Connected')) // If connection is successful, log success message
  .catch((err) => console.log('Error Connecting:', err.message)); // If connection fails, log error message

// Start the server
const port = 3000; // Port on which the server will listen
app.listen(port, () => {
  // Start the server and listen on the specified port
  console.log(`App running on port ${port}`); // Log a message indicating that the server is running
});
