const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const logger = require('../config/configLogging');
const errors = require('../config/errorsEnum');

const Exercise = require('../models/Exercise');

module.exports = {
    async create(request, response) {
        logger.info("Inbound request to /exercises/register");

        const { name, video } = request.body;

        try {
            const user = new User({ name, email, password, birthDate, sex, phones, city, state });
            const role = await Role.findOne({ name: 'Student' });

            user._id = uuidv4();
            user.roles = [role._id];
            await user.save();

            return response.json({ 
                statusCode: 200,
                data: {
                    _id: user._id
                } 
            });
        }
        catch(exc) {
            return response.status(exc.code == 11000 ? 400 : 500).json({
                statusCode: exc.code == 11000 ? 400 : 500,
                errorCode: exc.code == 11000 ? errors.VALIDATION_ERROR : errors.UNKNOWN_ERROR,
                message: "Could not register a new user",
                error: exc
            });
        }
    },
    async index(request, response) {

    },
    async show(request, response) {

    },
    async edit(request, response) {

    },
    async delete(request, response) {

    }
}