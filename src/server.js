const application = require('./app');
const logger = require('./config/configLogging');

const port = process.env.PORT;
application.listen(port, () => logger.info(`Server up and running on port ${port}`));
