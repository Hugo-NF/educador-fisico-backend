const logger = require('../config/configLogging');
const errors = require('../config/errorsEnum');

const Exercise = require('../models/Exercise');

module.exports = {
    // Register method
    async create(request, response) {
        logger.info("Inbound request to /exercise/register");

        const { name, video } = request.body;


        try {
            const exercise = new Exercise({name, video});

            await exercise.save();

            return response.json({ 
                statusCode: 200,
                data: {
                    exercise: exercise
                } 
            });
        }
        catch(exc) {
            return response.status(exc.code == 11000 ? 400 : 500).json({
                statusCode: exc.code == 11000 ? 400 : 500,
                errorCode: exc.code == 11000 ? errors.VALIDATION_ERROR : errors.UNKNOWN_ERROR,
                message: "Could not register a new exercise",
                error: exc
            });
        }
    },

    // Index method
    async index(request, response) {
        logger.info("Inbound request to /exercise/index");

        try {
            const exercises = await exercise.find()

            return response.json({
                statusCode: 200,
                data: {
                    exercises: exercises
                } 
            });
        } catch(exc) {
            return response.status(exc.code == 11000 ? 400 : 500).json({
                statusCode: exc.code == 11000 ? 400 : 500,
                errorCode: exc.code == 11000 ? errors.VALIDATION_ERROR : errors.UNKNOWN_ERROR,
                message: "Could not show the exercises",
                error: exc
            });
        }
    },

    // Show method
    async show(request, response) {
        logger.info("Inbound request to /exercise/show");

        const { id } = request.body;

        try {
            const exercise = await exercise.findById( id );
            
            return response.json({ 
                statusCode: 200,
                data: {
                    exercise: exercise
                }
            });
            
        } catch(exc) {
            return response.status(exc.code == 11000 ? 400 : 500).json({
                statusCode: exc.code == 11000 ? 400 : 500,
                errorCode: exc.code == 11000 ? errors.VALIDATION_ERROR : errors.UNKNOWN_ERROR,
                message: "Could not show this exercise",
                error: exc
            });
        }
    },

    // Edit method
    async edit(request, response) {
        logger.info("Inbound request to /exercise/edit");

        const { id, name, video } = request.body;

        try {
            const exercise = await exercise.findById( id );

            exercise.name = name;
            exercise.video = video;

            exercise.save();

            return response.json({ 
                statusCode: 200,
                data: {
                    exercise: exercise
                } 
            });
        } catch(exc) {
            return response.status(exc.code == 11000 ? 400 : 500).json({
                statusCode: exc.code == 11000 ? 400 : 500,
                errorCode: exc.code == 11000 ? errors.VALIDATION_ERROR : errors.UNKNOWN_ERROR,
                message: "Could not edit this exercise",
                error: exc
            });
        }
    },

    // Delete method
    async delete(request, response) {
        logger.info("Inbound request to /exercise/delete");

        const { id } = request.body;

        try {
            const exercise = await exercise.findByIdAndDelete( id );

            return response.json({ 
                statusCode: 200
            });
        } catch(exc) {
            return response.status(exc.code == 11000 ? 400 : 500).json({
                statusCode: exc.code == 11000 ? 400 : 500,
                errorCode: exc.code == 11000 ? errors.VALIDATION_ERROR : errors.UNKNOWN_ERROR,
                message: "Could not delete this exercise",
                error: exc
            });
        }
    }
}