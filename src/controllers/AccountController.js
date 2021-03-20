const logger = require('../config/configLogging');
const errors = require('../config/errorCodes');

const User = require('../models/User');

module.exports = {

  // Show method
  async show(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /users/login');

		const { id } = request.params;
    
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
          user : {
            name = user.name, 
            email = user.email,  
            birthDate = user.birthDate, 
            sex = user.sex, 
            phone = user.phone, 
            city = user.city, 
            state = user.state,
          }
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
    logger.info(`Request origin: ${request.id}`);
    logger.info('Inbound request to /user/login');

    const { id } = request.params;
    const {
      name, email, birthDate, sex, phone, city, state,
    } = request.body;

    try {
      const user = await User.findByIdAndUpdate(id, { name, email, birthDate, sex, phone, 
			city, state, }, { new: true });
      if (user == null) {
        logger.error(`/user/login: Could not find iser profile (${id})`);

        return response.status(404).json({
          statusCode: 404,
          errorCode: errors.RESOURCE_NOT_IN_DATABASE,
          message: 'Profile could not be found',
        });
      }

      logger.info(`Request to /user/login successfully logged (${id})`);
      return response.json({
        statusCode: 200,
        data: {
          user : {
            name = user.name, 
            email = user.email,  
            birthDate = user.birthDate, 
            sex = user.sex, 
            phone = user.phone, 
            city = user.city, 
            state = user.state,
          }
        },
      });
    } catch (exc) {
      logger.error(`Error while running /user/login. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not open profile ${id}`,
        error: exc,
      });
    }

    try {
      await user.updateOne({
        emailConfirmationTokenExpiration: currentUTC,
        emailConfirmed: false,
      });
    }

    // TODO: Replace e-mail info with real data as soon as available

  // Dispatch e-mail
  /* mailer.sendEmails([{ Email: email, Name: user.name }], 'Confirm Your Email', content, sandboxMode)
    .then(() => {
      logger.info(`E-mail with account activation token sent successfully to account (${email})`);

      return response.json({
        statusCode: 200,
        message: 'E-mail updated successfully',
      });
    })
    .catch((error) => {
      logger.error(`E-mail with account activation token failed to send to (${email}). Details: ${error}`);

      return response.status(503).json({
        statusCode: 503,
        errorCode: errors.MAILJET_UNAVAILABLE,
        message: 'Could not update e-mail',
      });
    });
  }, */
};
