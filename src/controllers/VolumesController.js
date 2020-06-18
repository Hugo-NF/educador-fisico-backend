const { v4: uuidv4 } = require('uuid');

const logger = require('../config/configLogging');
const errors = require('../config/errorsEnum');

const Volume = require('../models/Volume');

module.exports = {
    async create(request, response) {
        logger.info("Inbound request to /volume/register");

        const { repetition, charge, exercise } = request.body;

        try {
            const volume = new Volume({ repetition, charge, exercise });

            await volume.save();

            return response.json({ 
                statusCode: 200,
                data: {
                    _id: volume._id
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
    async edit(request, response) {
        logger.info("Inbound request to /volume/edit");

        const { id, repetition, charge, exercise } = request.body;

        try {
            const volume = await Volume.findById( id );

            volume.repetition = repetition;
            volume.charge = charge;
            volume.exercise = exercise;

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
                message: "Could not edit edit this volume",
                error: exc
            });
        }
    },
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