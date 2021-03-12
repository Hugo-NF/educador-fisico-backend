require('dotenv/config');
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
    openapi: '3.0.1',
    info: {
      title: 'Treino para Todos API',
      description: 'Documentação API do projeto Treino para Todos',
      contact: {
        name: 'Equipe Treino para Todos',
        url: 'https://github.com/Hugo-NF/educador-fisico-backend',
        email: 'hugonfonseca@hotmail.com',
      },
      termsOfService: 'http://treinoparatodos.com/terms',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Local development',
      },
      {
        url: 'https://treinoparatodos.com.br/v1/',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        Token: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Paste your authentication token on the input below',
        },
      },
    },
    //  security:
    //  - Token: []
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
application.use('/api/health', authorize(), healthRoutes);
application.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
application.use(errors());

module.exports = application;
