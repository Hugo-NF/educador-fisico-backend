const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const logger = require('./config/configLogging');

const connection = process.env.NODE_ENV === 'test' ? process.env.TESTDB_CONN_STRING : process.env.DB_CONN_STRING;
// Database connection
mongoose.connect(
  connection,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => {
    logger.info('Successfully connected to database');
  },
);

// Importing routes
const userRoutes = require('./routes/user');
const exerciseRoutes = require('./routes/exercise');
const circuitRoutes = require('./routes/circuit');

const { authorize } = require('./helpers/UsersHelper');

const application = express();

// Static resources setup
application.use(express.static('public'));

application.use(cors()); // Development only

// Content-Type will be application/json, (this MUST come before application routes)
application.use(express.json());

// Routes middleware configuration
application.use('/api/users', userRoutes);
application.use('/api/exercises', authorize('ManageTraining'), exerciseRoutes);
application.use('/api/circuits', authorize('ManageTraining'), circuitRoutes);
application.use(errors());

module.exports = application;
