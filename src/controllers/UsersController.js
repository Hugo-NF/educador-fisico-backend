const bcrypt = require('bcryptjs');

const logger = require('../config/configLogging');
const User = require('../models/User');

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
        return response.json({status: "Logado fdp"})
    },

    // Register method
    async create(request, response) {
        logger.info("Inbound request to /users/login");
        return response.json({ status: "Salve" });
    },
};