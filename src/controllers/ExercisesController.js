const logger = require('../config/configLogging');
const errors = require('../config/errorCodes');

const escapeRegex = require('../helpers/EscapeRegex');

const Exercise = require('../models/Exercise');

module.exports = {
  // Index method
  async index(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /exercises/index');

    const { page = 1, max = null } = request.query;
    const { name = '' } = request.body;

    try {
      const searchRegex = new RegExp(escapeRegex(name), 'gi');

      const count = await Exercise.countDocuments({ name: searchRegex });
      const maxPage = max === null ? count : max;

      const exercises = await Exercise.find({ name: searchRegex })
        .skip((maxPage * page) - maxPage)
        .limit(maxPage);

      logger.info(`Request to /exercises/index returned ${count} records`);
      return response.json({
        statusCode: 200,
        count,
        data: {
          exercises,
        },
      });
    } catch (exc) {
      logger.error(`Exception raised while running /exercises/index. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: 'Could not show index of exercises',
        error: exc,
      });
    }
  },

  // Register method
  async create(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /exercises/create');

    const { name, video } = request.body;

    try {
      const exercise = new Exercise({ name, video });

      await exercise.save();

      logger.info(`Exercise ${exercise._id} created successfully`);
      return response.json({
        statusCode: 201,
        data: {
          exercise,
        },
      });
    } catch (exc) {
      logger.error(`Exception raised while running /exercises/create. Details: ${exc}`);

      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: 'Could not create a new exercise',
        error: exc,
      });
    }
  },

  // Show method
  async show(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /exercises/show');

    const { id } = request.params;

    try {
      const exercise = await Exercise.findById(id);
      if (exercise == null) {
        logger.error(`/exercises/show: Could not find exercise with ObjectId(${id})`);
        return response.status(404).json({
          statusCode: 404,
          errorCode: errors.RESOURCE_NOT_IN_DATABASE,
          message: 'Exercise could not be found',
        });
      }

      logger.info(`Request to /exercises/show successfully returned ObjectId(${id})`);
      return response.json({
        statusCode: 200,
        data: {
          exercise,
        },
      });
    } catch (exc) {
      logger.error(`Error while running /exercises/show. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not retrieve exercise with id: ${id}`,
        error: exc,
      });
    }
  },

  // Edit method
  async edit(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /exercises/edit');

    const { name, video } = request.body;
    const { id } = request.params;

    try {
      const exercise = await Exercise.findByIdAndUpdate(id, { name, video }, { new: true });
      if (exercise == null) {
        logger.error(`/exercises/edit: Could not find exercise with ObjectId(${id})`);

        return response.status(404).json({
          statusCode: 404,
          errorCode: errors.RESOURCE_NOT_IN_DATABASE,
          message: 'Exercise could not be found',
        });
      }

      logger.info(`Request to /exercises/edit successfully edited ObjectId(${id})`);
      return response.json({
        statusCode: 200,
        data: {
          exercise,
        },
      });
    } catch (exc) {
      logger.error(`Error while running /exercises/edit. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not edit exercise with ${id}`,
        error: exc,
      });
    }
  },

  // Delete method
  async delete(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /exercises/delete');

    const { id } = request.params;

    try {
      const exercise = await Exercise.findByIdAndDelete(id);
      if (exercise == null) {
        logger.error(`/exercises/delete: Could not find exercise with ObjectId(${id})`);

        return response.status(404).json({
          statusCode: 404,
          errorCode: errors.RESOURCE_NOT_IN_DATABASE,
          message: 'Exercise could not be found',
        });
      }

      logger.info(`Request to /exercises/delete successfully deleted ObjectId(${id})`);
      return response.json({
        statusCode: 200,
        data: { exercise },
      });
    } catch (exc) {
      logger.error(`Error while running /exercises/delete. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not delete exercise with ${id}`,
        error: exc,
      });
    }
  },
};
