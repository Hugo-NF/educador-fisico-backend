const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const mongoose = require('mongoose');

// Database connection
mongoose.connect(
    process.env.COSMOSDB_CONN_STRING,
    { useNewUrlParser: true,
      useUnifiedTopology: true 
    },
    () => { 
        console.log("Successfully connected to Azure CosmosDB");
    }
);


// Importing routes
const userRoutes = require('./routes/user');

const application = express();

application.use(cors()); // Development only

// Content-Type will be application/json, (this MUST come before application routes)
application.use(express.json());

// Routes middleware configuration
application.use('/api/users', userRoutes);
application.use('/', (req, res) => {res.json({'status': 'Salve Família'})});
application.use(errors());

let port = 3333;
application.listen(port, () => console.log(`Server up and running on port ${port}`));