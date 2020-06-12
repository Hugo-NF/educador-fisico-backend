const jwt = require('jsonwebtoken');
const errors = require('../config/errorsEnum');
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
    },

    async updateLockout(user, currentUTC) {
        user.accessFailedCount += 1;
                
        if(user.accessFailedCount >= user.accessFailedLimit) {
            let lockoutUntil = currentUTC;
            lockoutUntil = lockoutUntil.setFullYear(lockoutUntil.getFullYear() + 200);

            await user.update({
                accessFailedCount: user.accessFailedCount,
                lockoutUntil: lockoutUntil,
                lockoutReason: 'ACCESS_FAILED'
            });

            return {
                statusCode: 401,
                errorCode: errors.ACCESS_FAILED_LIMIT_REACHED,
                message: `Access Failed limit reached`,
                error: {
                    lockoutUntil: lockoutUntil,
                    lockoutReason: 'ACCESS_FAILED'
                }
            };
        }

        await user.update({ accessFailedCount: user.accessFailedCount });
        
        return {
            statusCode: 401,
            errorCode: errors.WRONG_PASSWORD,
            message: `Passwords do not match`
        };
    }
}
