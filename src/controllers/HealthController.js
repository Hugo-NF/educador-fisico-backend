const logger = require('../config/configLogging');
const errors = require('../config/errorCodes');

const { calculateIMC, calculateIAC } = require('../helpers/HealthHelper');
const { currentUserId } = require('../helpers/UsersHelper');

const User = require('../models/User');
const Health = require('../models/Health');

module.exports = {
  async create(request, response) {
    const id = currentUserId(request);
    logger.info(`Request origin: ${request.ip}`);
    logger.info(`Inbound request to /health/create. User (${id})`);

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

      logger.info(`User (${id}) added a new health checkpoint successfully`);
      return response.json({
        statusCode: 200,
        message: 'New checkpoint successfully added',
      });
    } catch (exc) {
      logger.info(`Exception occurred when trying to add Health Checkpoint to User (${id}). Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        message: `Error while saving new checkpoint to user(${id})`,
        error: exc,
      });
    }
  },

  // Show method
  async show(request, response) {
    const id = currentUserId(request);
    logger.info(`Request origin: ${request.ip}`);
    logger.info(`Inbound request to /health/show. User (${id})`);

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

        logger.info(`Checkpoints between ${startDate} and ${endDate} returned to user (${id}).`);
        return response.json({
          statusCode: 200,
          startDate,
          endDate,
          data: user.healthCheckpoints.filter((element) => element.createdAt >= startDate && element.createdAt < endDate),
        });
      }

      logger.info(`All health checkpoints returned to user (${id}).`);
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
    const userId = currentUserId(request);
    logger.info(`Request origin: ${request.ip}`);
    logger.info(`Inbound request to /health/delete. User (${id})`);

    try {
      // Removes reference from User
      const previousUser = await User.findOneAndUpdate({ _id: userId }, { $pullAll: { healthCheckpoints: [id] } });
      if (!previousUser.healthCheckpoints.includes(id)) {
        logger.warn(`User (${userId}) tried to delete a checkpoint (${id}) from someone else`);

        return response.status(403).json({
          statusCode: 403,
          errorCode: errors.RESOURCE_OWNERSHIP_MISMATCH,
          message: 'Current user is NOT allowed to access this resource',
        });
      }

      // Delete from Health collection
      const checkpoint = await Health.findByIdAndDelete(id);

      if (checkpoint == null) {
        logger.warn(`User (${userId}) tried to delete a unknown checkpoint (${id})`);

        return response.status(404).json({
          statusCode: 404,
          errorCode: errors.RESOURCE_NOT_IN_DATABASE,
          message: 'Health checkpoint could not be found',
        });
      }

      logger.info(`User (${userId}) deleted a checkpoint (${id}) successfully`);
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
