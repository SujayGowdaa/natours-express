const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

// Middlewares
app.use(morgan('dev'));
app.use(express.json()); // express middleware: Basically a function to modify incoming req uest data, this is called middleware because it stands between req and res.

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

module.exports = app;
