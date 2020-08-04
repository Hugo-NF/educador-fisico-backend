const logger = require('../config/configLogging');
const errors = require('../config/errorsEnum');

const { calculateIMC, calculateIAC } = require('../helpers/HealthHelper');

const User = require('../models/User');
const Health = require('../models/Health');

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
        ipaq: {
          walkPerWeek1a,
          walkTimePerDay1b,
          moderateActivityPerWeek2a,
          moderateActivityTimePerDay2b,
          vigorousActivityPerWeek3a,
          vigorousActivityTimePerDay3b,
          seatedTimeWeekday4a,
          seatedTimeWeekend4b,
        },
        objective,
      } = request.body;

      const imc = calculateIMC(height, weight);
      const iac = calculateIAC(hip, height);

      const healthCheckpoint = new Health({
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
        ipaq: {
          walkPerWeek1a,
          walkTimePerDay1b,
          moderateActivityPerWeek2a,
          moderateActivityTimePerDay2b,
          vigorousActivityPerWeek3a,
          vigorousActivityTimePerDay3b,
          seatedTimeWeekday4a,
          seatedTimeWeekend4b,
        },
        objective,
      });

      await healthCheckpoint.save();
      await user.updateOne({
        $push: { healthCheckpoints: healthCheckpoint._id },
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

    let { startDate, endDate = new Date() } = request.body;

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

      await user.populate('healthCheckpoints').execPopulate();

      if (startDate !== undefined) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        return response.json({
          statusCode: 200,
          startDate,
          endDate,
          data: user.healthCheckpoints.filter((element) => element.createdAt >= startDate && element.createdAt < endDate),
        });
      }

      return response.json({
        statusCode: 200,
        data: user.healthCheckpoints,
      });
    } catch (exc) {
      logger.error(`Error while running /health/show. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not retrieve health checkpoints for user(${id})`,
        error: exc,
      });
    }
  },

  // Delete method
  async delete(request, response) {
    const { id } = request.params;

    try {
      // Delete from Health collection
      const checkpoint = await Health.findByIdAndDelete(id);
      // Removes reference from User
      await User.findOneAndUpdate({ _id: '8719d08e-78ce-4c80-b936-71b2a258cbd5' }, { $pullAll: { healthCheckpoints: [id] } });

      if (checkpoint == null) {
        return response.status(404).json({
          statusCode: 404,
          data: checkpoint,
        });
      }

      return response.json({
        statusCode: 200,
        data: checkpoint,
      });
    } catch (exc) {
      logger.error(`Error while running /healthCheckpoint/delete. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not delete healthCheckpoint with ${id}`,
        error: exc,
      });
    }
  },
};
