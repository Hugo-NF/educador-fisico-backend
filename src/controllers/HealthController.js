const logger = require('../config/configLogging');
const errors = require('../config/errorsEnum');

const { calculateIMC, calculateIAC } = require('../helpers/HealthHelper');

const User = require('../models/User');

module.exports = {
  async create(request, response) {
    const { id } = request.params;
    try {
      const user = await User.findById(id);

      if (!user) {
        logger.warn(`An unregistered user (ID: ${id}) tried to create a health checkpoint`);

        return response.status(409).json({
          statusCode: 409,
          errorCode: errors.USER_NOT_IN_DATABASE,
          message: 'User is not in database',
        });
      }

      const {
        measures: {
          height,
          weight,
          chest,
          waist,
          abdomen,
          hip,
          forearm,
          arm,
          thigh,
          calf,
        },
        bodyStats: {
          vo2max,
          fatPercentage,
        },
        objective,
      } = request.body;

      const imc = calculateIMC(height, weight);
      const iac = calculateIAC(hip, height);

      await user.updateOne({
        $push: {
          healthCheckpoints: {
            date: new Date(),
            measures: {
              height,
              weight,
              chest,
              waist,
              abdomen,
              hip,
              forearm,
              arm,
              thigh,
              calf,
            },
            bodyStats: {
              imc,
              iac,
              vo2max,
              fatPercentage,
            },
            objective,
          },
        },
      });

      return response.json({
        statusCode: 200,
        message: 'New checkpoint successfully added',
      });
    } catch (exc) {
      return response.status(500).json({
        statusCode: 500,
        message: 'Error while saving new checkpoint',
        error: exc,
      });
    }
  },

  // Show method
  async show(request, response) {
    const { id } = request.params;

    try {
      const user = await User.findById(id);
      if (!user) {
        logger.error(`An unregistered user (ID: ${id}) tried to open a health checkpoint`);
        return response.status(404).json({
          statusCode: 404,
          errorCode: errors.USER_NOT_IN_DATABASE,
          message: 'User is not in database',
        });
      }

      return response.json({
        statusCode: 200,
        data: {
          healthCheckpoints: user.healthCheckpoints,
        },
      });
    } catch (exc) {
      logger.error(`Error while running /health/show. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not retrieve user with id: ${id}`,
        error: exc,
      });
    }
  },

  async delete(request, response) {
    return response.json({
      statusCode: 200,
    });
  },
};
