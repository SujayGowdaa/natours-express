const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log('DB Connected'))
  .catch((err) => console.log('Error Connecting:', err.message));

// Define a Mongoose schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour mush have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// Create a Mongoose model based on the schema
const Tour = mongoose.model('Tour', tourSchema);

// Create a new instance of the 'Tour' model with some initial data
const testTour = new Tour({
  name: 'The Test Tour 2',
  rating: 4.5,
  price: '3444',
});

// Save the new tour instance to the database
testTour
  .save()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log('Error occured: 💥', err.message);
  });

// Server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
