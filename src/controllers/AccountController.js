const logger = require('../config/configLogging');
const errors = require('../config/errorCodes');

const User = require('../models/User');

module.exports = {

  // Show method
  async show(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /users/login');

		const { id };
    const {
      name, email, birthDate, sex, phone, city, state,
    } = request.body;

    try {
      const user = await User.findById(id);
      if (user == null) {
        logger.error(`/user/show: Could not find user ${id}`);
        return response.status(404).json({
          statusCode: 404,
          errorCode: errors.RESOURCE_NOT_IN_DATABASE,
          message: 'User not found',
        });
      }

      logger.info(`User ${id} successfully logged`);
      return response.json({
        statusCode: 200,
        data: {
          name, 
					email,  
					birthDate, 
					sex, 
					phone, 
					city, 
					state,
        },
      });
    } catch (exc) {
      logger.error(`Error while running /user/show. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not retrieve profile`,
        error: exc,
      });
    }
  },

  // Edit method
  async edit(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /exercise/edit');

    const {
      name, email, birthDate, sex, phone, city, state,
    } = request.body;

    try {
      const user = await User.findByIdAndUpdate(email, { name, email, birthDate, sex, phone, 
			city, state, }, { new: true });
      if (user == null) {
        logger.error(`/exercise/edit: Could not find exercise with ObjectId(${id})`);

        return response.status(404).json({
          statusCode: 404,
          errorCode: errors.RESOURCE_NOT_IN_DATABASE,
          message: 'Exercise could not be found',
        });
      }

      logger.info(`Request to /exercise/edit successfully edited ObjectId(${id})`);
      return response.json({
        statusCode: 200,
        data: {
          exercise,
        },
      });
    } catch (exc) {
      logger.error(`Error while running /exercise/edit. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not edit exercise with ${id}`,
        error: exc,
      });
    }
  },
};
