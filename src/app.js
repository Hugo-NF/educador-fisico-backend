const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const logger = require('./config/configLogging');

// Importing routes
const userRoutes = require('./routes/user');
const exerciseRoutes = require('./routes/exercise');
const circuitRoutes = require('./routes/circuit');
const healthRoutes = require('./routes/health');

const { authorize } = require('./helpers/UsersHelper');

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

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Treino para Todos API',
      description: 'Informações sobre a API do Treino para Todos',
      contact: {
        name: 'Mota',
      },
      servers: ['http://localhost:3000'],
    },
  },
  apis: ['src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

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
application.use('/api/health', healthRoutes);
application.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
application.use(errors());

module.exports = application;
