// Import required modules
const dotenv = require('dotenv'); // dotenv for environment variables, call before importing other modules ensures that environment variables are properly set up and available for use throughout the application.

// This event listener captures uncaught exceptions.
// Capture Unhandled Errors: By setting up the event listener early, you ensure that any unhandled exceptions occurring during the execution of your application will be captured. If an uncaught exception were to occur before the listener is set up, it could crash the application without any opportunity for handling or logging the error.

// When an uncaught exception occurs, this event is triggered.
process.on('uncaughtException', (err) => {
  // Log a message indicating an uncaught exception has occurred.
  console.log('Uncaught Exception: 💥 Shutting down...');

  // Log the name and message of the error for debugging purposes.
  console.log(err.name, err.message);

  // Once the server is closed, exit the process with a non-zero status code (1) to indicate an error.
  process.exit(1);
});

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
  .then(() => console.log('DB Connected')); // If connection is successful, log success message
// .catch((err) => console.log('Error Connecting:', err.message)); // If connection fails, log error message

// Start the server
const port = 3000; // Port on which the server will listen
const server = app.listen(port, () => {
  // Start the server and listen on the specified port
  console.log(`App running on port ${port}`); // Log a message indicating that the server is running
});

// This event listener captures unhandled promise rejections.
// When a promise rejection occurs and is not caught, this event is triggered.
process.on('unhandledRejection', (err) => {
  // Log a message indicating an unhandled rejection has occurred.
  console.log('Unhandled Rejection: 💥 Shutting down...');

  // Log the error to the console for debugging purposes.
  console.log(err.name, err.message);

  // Close the server gracefully before exiting the process.
  // This is done to ensure any remaining connections are properly closed.
  server.close(() => {
    // Once the server is closed, exit the process with a non-zero status code (1) to indicate an error.
    process.exit(1);
  });
});
