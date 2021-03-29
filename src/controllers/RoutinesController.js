const logger = require('../config/configLogging');
const errors = require('../config/errorCodes');

const escapeRegex = require('../helpers/EscapeRegex');

const Routine = require('../models/Routine');

module.exports = {
  // Index method
  async index(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /routines/index');

    const { page = 1, max = null } = request.query;
    const { name = '' } = request.body;

    try {
      const searchRegex = new RegExp(escapeRegex(name), 'gi');

      const count = await Routine.countDocuments({ name: searchRegex });
      const maxPage = max === null ? count : max;

      const routines = await Routine.find({ name: searchRegex })
        .skip((maxPage * page) - maxPage)
        .limit(maxPage);

      logger.info(`Request to /routines/index returned ${count} records`);
      return response.json({
        statusCode: 200,
        count,
        data: {
          routines,
        },
      });
    } catch (exc) {
      logger.error(`Exception raised while running /routines/index. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: 'Could not show index of routines',
        error: exc,
      });
    }
  },

  // Register method
  async create(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /routines/create');

    const { name, interval, circuits } = request.body;

    try {
      const routine = new Routine({ name, interval, circuits });

      await routine.save();

      logger.info(`Routine ${routine._id} created successfully`);
      return response.json({
        statusCode: 200,
        data: {
          routine,
        },
      });
    } catch (exc) {
      logger.error(`Exception raised while running /routines/create. Details: ${exc}`);

      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: 'Could not create a new routine',
        error: exc,
      });
    }
  },

  // Show method
  async show(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /routines/show');

    const { id } = request.params;

    try {
      const routine = await Routine.findById(id);
      if (routine == null) {
        logger.error(`/routines/show: Could not find routine with ObjectId(${id})`);
        return response.status(404).json({
          statusCode: 404,
          errorCode: errors.RESOURCE_NOT_IN_DATABASE,
          message: 'Routine could not be found',
        });
      }

      logger.info(`Request to /routines/show successfully returned ObjectId(${id})`);
      return response.json({
        statusCode: 200,
        data: {
          routine,
        },
      });
    } catch (exc) {
      logger.error(`Error while running /routines/show. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not retrieve routine with id: ${id}`,
        error: exc,
      });
    }
  },

  // Edit method
  async edit(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /routines/edit');

    const { name, interval, circuits } = request.body;
    const { id } = request.params;

    try {
      const routine = await Routine.findByIdAndUpdate(id, { name, interval, circuits }, { new: true });
      if (routine == null) {
        logger.error(`/routines/edit: Could not find routine with ObjectId(${id})`);

        return response.status(404).json({
          statusCode: 404,
          errorCode: errors.RESOURCE_NOT_IN_DATABASE,
          message: 'Routine could not be found',
        });
      }

      logger.info(`Request to /routines/edit successfully edited ObjectId(${id})`);
      return response.json({
        statusCode: 200,
        data: {
          routine,
        },
      });
    } catch (exc) {
      logger.error(`Error while running /routines/edit. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not edit routine with ${id}`,
        error: exc,
      });
    }
  },

  // Delete method
  async delete(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /routines/delete');

    const { id } = request.params;

    try {
      const routine = await Routine.findByIdAndDelete(id);
      if (routine == null) {
        logger.error(`/routines/delete: Could not find routine with ObjectId(${id})`);

        return response.status(404).json({
          statusCode: 404,
          errorCode: errors.RESOURCE_NOT_IN_DATABASE,
          message: 'Routine could not be found',
        });
      }

      logger.info(`Request to /routines/delete successfully deleted ObjectId(${id})`);
      return response.json({
        statusCode: 200,
        data: { routine },
      });
    } catch (exc) {
      logger.error(`Error while running /routines/delete. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not delete routine with ${id}`,
        error: exc,
      });
    }
  },
};
