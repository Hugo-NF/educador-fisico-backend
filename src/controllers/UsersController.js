const bcrypt = require('bcryptjs');

const User = require('../models/User');

/**
 * Parameters:
 * 
 * Query: accessible through variable request.query, ex.: http://yourcompleteurl/route/?page=2
 * Route: accessible through variable request.params, ex.: http://yourcompleteurl/users/:id
 * Body: accessible through variable request.body. POST, PUT HTTP methods
 */

module.exports = {

    // Register method
    async create(request, response) {
        return response.json({ status: "Salve" });
    },
};