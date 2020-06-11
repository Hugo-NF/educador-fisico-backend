const dotenv = require('dotenv').config();
const application = require('./app');
const logger = require('./config/configLogging');

let port = process.env.PORT;
application.listen(port, () => logger.info(`Server up and running on port ${port}`));