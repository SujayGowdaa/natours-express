const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require('morgan');

// 1. Middlewares
app.use(morgan('dev'));
app.use(express.json()); // express middleware: Basically a function to modify incoming req uest data, this is called middleware because it stands between req and res.

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`,
    'utf-8',
    (err, data) => {
      return data;
    }
  )
);

// 2. Handling Requests
// Tours
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};
const getTour = (req, res) => {
  const tour = tours.find((el) => el.id === Number(req.params.id));

  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'No data to display',
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: tour,
    });
  }
};
const createTour = (req, res) => {
  const tour = req.body;
  const newId = tours[tours.length - 1].id + 1;
  const newTour = {
    id: newId,
    ...tour,
  };
  tours.push(newTour);
  fs.writeFile(
    // When synchronous code is used within a callback function in Node.js, it can block the event loop, causing performance issues and potentially leading to poor scalability and responsiveness of the application. This is because while synchronous code is being executed, the event loop is unable to handle other tasks, such as responding to incoming requests or performing other asynchronous operations.

    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours), // JSON stands for JavaScript Object Notation. It's a lightweight data interchange format that is easy for both humans to read and write and for machines to parse and generate. However, when you're transmitting data over the network, it needs to be in the form of strings. Stringifying JSON converts JavaScript objects into JSON strings, making them suitable for transmission.
    (err) => {
      if (err) {
        console.log('Error writing data', err);
        res.status(500).json({
          status: 'Failed',
          message: 'Error writing data',
        });
      } else {
        res.status(201).json({
          status: 'success',
          data: newTour,
        });
      }
    }
  );
};
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'No data to update',
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        data: 'Updated tour here...',
      },
    });
  }
};
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'No data to delete',
    });
  } else {
    res.status(204).json({
      status: 'success',
      data: {
        data: null,
      },
    });
  }
};

// Users
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not defined',
  });
};

// 3. Routes
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour); // out of the box express doesn't return client data to the request, so in order to get the data we have to use middleware.
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// alternative way of declaring routes
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// 4. Server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
