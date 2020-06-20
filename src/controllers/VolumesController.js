const { v4: uuidv4 } = require('uuid');

const logger = require('../config/configLogging');
const errors = require('../config/errorsEnum');

const Volume = require('../models/Volume');

module.exports = {
    // Register method
    async create(request, response) {
        logger.info("Inbound request to /volume/register");

        const { repetition, charge, exercise, observation } = request.body;

        try {
            const volume = new Volume({ repetition, charge, exercise, observation });

            await volume.save();

            return response.json({ 
                statusCode: 200,
                data: {
                    volume: volume
                } 
            });
        }
        catch(exc) {
            return response.status(exc.code == 11000 ? 400 : 500).json({
                statusCode: exc.code == 11000 ? 400 : 500,
                errorCode: exc.code == 11000 ? errors.VALIDATION_ERROR : errors.UNKNOWN_ERROR,
                message: "Could not register a new volume",
                error: exc
            });
        }
    },

    // Index method
    async index(request, response) {
        logger.info("Inbound request to /volume/index");

        try {
            const volumes = await Volume.find()

            return response.json({
                statusCode: 200,
                data: {
                    volumes: volumes
                } 
            });
        } catch(exc) {
            return response.status(exc.code == 11000 ? 400 : 500).json({
                statusCode: exc.code == 11000 ? 400 : 500,
                errorCode: exc.code == 11000 ? errors.VALIDATION_ERROR : errors.UNKNOWN_ERROR,
                message: "Could not show the volumes",
                error: exc
            });
        }
    },

    // Show method
    async show(request, response) {
        logger.info("Inbound request to /volume/show");

        const { id } = request.body;

        try {
            const volume = await Volume.findById( id );
            
            return response.json({ 
                statusCode: 200,
                data: {
                    volume: volume
                }
            });
            
        } catch(exc) {
            return response.status(exc.code == 11000 ? 400 : 500).json({
                statusCode: exc.code == 11000 ? 400 : 500,
                errorCode: exc.code == 11000 ? errors.VALIDATION_ERROR : errors.UNKNOWN_ERROR,
                message: "Could not show this volume",
                error: exc
            });
        }
    },

    // Edit method
    async edit(request, response) {
        logger.info("Inbound request to /volume/edit");

        const { id, repetition, charge, exercise, observation } = request.body;

        try {
            const volume = await Volume.findById( id );

            volume.repetition = repetition;
            volume.charge = charge;
            volume.exercise = exercise;
            volume.observation = observation;

            volume.save();

            return response.json({ 
                statusCode: 200,
                data: {
                    volume: volume
                } 
            });
        } catch(exc) {
            return response.status(exc.code == 11000 ? 400 : 500).json({
                statusCode: exc.code == 11000 ? 400 : 500,
                errorCode: exc.code == 11000 ? errors.VALIDATION_ERROR : errors.UNKNOWN_ERROR,
                message: "Could not edit this volume",
                error: exc
            });
        }
    },

    // Delete method
    async delete(request, response) {
        logger.info("Inbound request to /volume/delete");

        const { id } = request.body;

        try {
            const volume = await Volume.findByIdAndDelete( id );

            return response.json({ 
                statusCode: 200
            });
        } catch(exc) {
            return response.status(exc.code == 11000 ? 400 : 500).json({
                statusCode: exc.code == 11000 ? 400 : 500,
                errorCode: exc.code == 11000 ? errors.VALIDATION_ERROR : errors.UNKNOWN_ERROR,
                message: "Could not delete this volume",
                error: exc
            });
        }
    }
}