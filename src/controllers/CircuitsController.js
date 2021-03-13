const logger = require('../config/configLogging');
const errors = require('../config/errorCodes');

const escapeRegex = require('../helpers/EscapeRegex');

const Circuit = require('../models/Circuit');

module.exports = {
  // Index method
  async index(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /circuits/index');

    const { page = 1, max = null } = request.query;
    const { name = '' } = request.body;

    try {
      const searchRegex = new RegExp(escapeRegex(name), 'gi');

      const count = await Circuit.countDocuments({ name: searchRegex });
      const maxPage = max === null ? count : max;

      const circuits = await Circuit.find({ name: searchRegex })
        .populate('exercises.exercise')
        .skip((maxPage * page) - maxPage)
        .limit(maxPage);

      logger.info(`Inbound request to /circuits/index returned ${count} records`);
      return response.json({
        statusCode: 200,
        count,
        data: {
          circuits,
        },
      });
    } catch (exc) {
      logger.info(`Exception while running /circuits/index. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: 'Could not retrieve the circuits',
        error: exc,
      });
    }
  },

  async create(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /circuits/create');

    const { name, exercises } = request.body;

    try {
      const circuit = new Circuit({ name, exercises });

      logger.info(`/circuits/create created ${circuit._id} record`);
      return response.json({
        statusCode: 200,
        data: {
          circuit: await (await circuit.save()).populate('exercises.exercise').execPopulate(),
        },
      });
    } catch (exc) {
      logger.error(`Exception while running /circuits/create. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: 'Could not create a new circuit',
        error: exc,
      });
    }
  },

  // Show method
  async show(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /circuits/show');

    const { id } = request.params;

    try {
      const circuit = await Circuit.findById(id).populate('exercises.exercise');
      if (circuit == null) {
        logger.error(`/circuits/show: Could not find circuit with ObjectId(${id})`);

        return response.status(404).json({
          statusCode: 404,
          errorCode: errors.RESOURCE_NOT_IN_DATABASE,
          message: 'Circuit could not be found',
        });
      }

      logger.info(`Request to /circuits/show successfully returned ObjectId(${id})`);
      return response.json({
        statusCode: 200,
        data: {
          circuit,
        },
      });
    } catch (exc) {
      logger.error(`Error while running /circuits/show. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not show circuit with id: ${id}`,
        error: exc,
      });
    }
  },

  // Edit method
  async edit(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /circuits/edit');

    const { id } = request.params;
    const { name, exercises } = request.body;

    try {
      const circuit = await Circuit.findByIdAndUpdate(id, { name, exercises }, { new: true }).populate('exercises.exercise');
      if (circuit == null) {
        logger.error(`/circuits/edit: Could not find circuit with ObjectId(${id})`);

        return response.status(404).json({
          statusCode: 404,
          errorCode: errors.RESOURCE_NOT_IN_DATABASE,
          message: 'Circuit could not be found',
        });
      }

      logger.info(`Request to /circuits/edit successfully edited ObjectId(${id})`);
      return response.json({
        statusCode: 200,
        data: {
          circuit,
        },
      });
    } catch (exc) {
      logger.error(`Error while running /circuits/edit. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not edit circuit with ${id}`,
        error: exc,
      });
    }
  },

  // Delete method
  async delete(request, response) {
    logger.info(`Request origin: ${request.ip}`);
    logger.info('Inbound request to /circuits/delete');

    const { id } = request.params;

    try {
      const circuit = await Circuit.findByIdAndDelete(id);
      if (circuit == null) {
        logger.error(`/circuits/delete: Could not find circuit with ObjectId(${id})`);

        return response.status(404).json({
          statusCode: 404,
          errorCode: errors.RESOURCE_NOT_IN_DATABASE,
          message: 'Circuit could not be found',
        });
      }
      logger.info(`Request to /circuits/delete successfully deleted ObjectId(${id})`);

      return response.json({
        statusCode: 200,
        data: { circuit },
      });
    } catch (exc) {
      logger.error(`Error while running /circuits/delete. Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: `Could not delete circuit with ${id}`,
        error: exc,
      });
    }
  },
};
