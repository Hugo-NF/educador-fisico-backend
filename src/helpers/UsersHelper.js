const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require ('../models/User');

module.exports = {
    async authorize(claim) {
        return function(request, response, next) {

            const token = request.header('auth-token');
            if(!token) return response.status(401).json({
                'status': 'error',
                'error': "Unauthorized"
            });

            try {
                const verified = jwt.verify(token, process.env.JWT_SECRET);

                if(verified._id != undefined) {
                    User.findById(verified._id)
                    .then((user) => {
                        console.log(user);
                        return next();
                    })
                    .catch((error) => {
                        console.log(error);
                        return response.status(500).json(error);
                    });
                }
                else {
                    return response.status(401).json({
                        'status': 'error',
                        'error': "Unauthorized"
                    });
                }
            }
            catch (error) {
                return response.status(500).json(error);
            }
        }
    }
}
