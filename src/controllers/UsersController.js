const { v4: uuidv4 } = require('uuid');

const logger = require('../config/configLogging');
const User = require('../models/User');
const Role = require('../models/Role');

/**
 * Parameters:
 * 
 * Query: accessible through variable request.query, ex.: http://yourcompleteurl/route/?page=2
 * Route: accessible through variable request.params, ex.: http://yourcompleteurl/users/:id
 * Body: accessible through variable request.body. POST, PUT HTTP methods
 */

module.exports = {

    // Login method 
    async login(request, response) {
        logger.info("Inbound request to /users/login");



        return response.json({
            statusCode: 200,
            message: "Logged in successfully",
            data: {
                'auth-token': 'token'
            }
        });
    },

    // Register method
    async create(request, response) {
        logger.info("Inbound request to /users/register");

        const { name, email, password, birthDate, sex, phones, city, state } = request.body;

        try {
            const user = new User({ name, email, password, birthDate, sex, phones, city, state });
            const role = await Role.findOne({name: 'Student'});

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
            return response.status(400).json({
                statusCode: 400,
                message: "Could not register a new user",
                error: exc
            });
        }
    },
};