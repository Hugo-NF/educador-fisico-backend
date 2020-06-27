const logger = require('../config/configLogging');
const errors = require('../config/errorsEnum');

const Exercise = require('../models/Exercise');

module.exports = {
  // Index method
  async index(request, response) {
    logger.info('Inbound request to /exercise/index');

    try {
      const exercises = await Exercise.find();

      return response.json({
        statusCode: 200,
        data: {
          exercises,
        },
      });
    } catch (exc) {
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: 'Could not show the exercises',
        error: exc,
      });
    }
  },

  // Register method
  async create(request, response) {
    logger.info('Inbound request to /exercise/create');

    const { name, video } = request.body;

    try {
      const exercise = new Exercise({ name, video });

      await exercise.save();

      return response.json({
        statusCode: 200,
        data: {
          exercise,
        },
      });
    } catch (exc) {
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: 'Could not register a new exercise',
        error: exc,
      });
    }
  },

  // Show method
  async show(request, response) {
    logger.info('Inbound request to /exercise/show');

    const { id } = request.params;

    try {
      const exercise = await Exercise.findById(id);

      return response.json({
        statusCode: 200,
        data: {
          exercise,
        },
      });
    } catch (exc) {
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
    logger.info('Inbound request to /exercise/edit');

    const { name, video } = request.body;
    const { id } = request.params;

    try {
      await Exercise.findByIdAndUpdate(id, { name, video });

      return response.json({
        statusCode: 200,
        data: {
          exercise: await Exercise.findById(id),
        },
      });
    } catch (exc) {
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
    logger.info('Inbound request to /exercise/delete');

    const { id } = request.params;

    try {
      await Exercise.findByIdAndDelete(id);

      return response.json({
        statusCode: 200,
      });
    } catch (exc) {
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not delete exercise with ${id}`,
        error: exc,
      });
    }
  },
};
