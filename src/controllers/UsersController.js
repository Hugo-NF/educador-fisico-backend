const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const logger = require('../config/configLogging');
const errors = require('../config/errorsEnum');

const mailer = require('../services/mailjet');

const User = require('../models/User');
const Role = require('../models/Role');

const { generateJWT, updateLockout } = require('../helpers/UsersHelper');

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
        const currentUTC = new Date(new Date().toUTCString());
        
        const { email, password } = request.body;

        try {
            // Find user
            const user = await User.findOne({ email: email });
            if(!user) {
                return response.status(409).json({
                    statusCode: 409,
                    errorCode: errors.USER_NOT_IN_DATABASE,
                    message: "User is not in database"
                });
            }

            // Check lockout
            if(user.lockoutUntil > currentUTC) {
                return response.status(401).json({
                    statusCode: 401,
                    errorCode: errors.ACCOUNT_LOCK_OUT,
                    message: `Your account is locked until ${user.lockoutUntil}`,
                    error: {
                        lockoutReason: user.lockoutReason
                    }
                });
            }

            // Check password
            const passwordCorrect = await bcrypt.compare(password, user.password);
            if(!passwordCorrect) {
                // Update lockout settings
                const lockout = await updateLockout(user, currentUTC);
                return response.status(lockout.statusCode).json(lockout);
            }

            // Resets lockout count    
            if(user.accessFailedCount != 0) await user.update({ accessFailedCount: 0 });
            
            const authToken = await generateJWT(user);
            
            return response.json({
                statusCode: 200,
                message: "Logged in successfully",
                data: {
                    name: user.name,
                    email: user.email,
                    'auth-token': authToken
                }
            });
        }
        catch (exc) {
            return response.status(400).json({
                statusCode: 400,
                message: "Login unavailable",
                error: exc
            });
        }
    },

    // Register method
    async create(request, response) {
        logger.info("Inbound request to /users/register");

        const { name, email, password, birthDate, sex, phones, city, state } = request.body;

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
            return response.status(400).json({
                statusCode: exc.code == 11000 ? 400 : 500,
                errorCode: exc.code == 11000 ? errors.VALIDATION_ERROR : errors.UNKNOWN_ERROR,
                message: "Could not register a new user",
                error: exc
            });
        }
    },

    async sendRecoverEmail(request, response) {
        const { email } = request.body;

        const user = User.find({ email: email });
        if(!user) {
            return response.status(409).json({
                statusCode: 409,
                errorCode: errors.USER_NOT_IN_DATABASE,
                message: "User is not in database"
            });
        } 

        mailer.sendSingleEmail(email, user.name, "Password Recovery E-mail", "Pega na minha kaceta")
        .then((result) => {
            console.log(result);
            return response.json({
                statusCode: 200,
                message: `E-mail sent successfully to ${user.email}`
            });
        })
        .catch((error) => {
            console.log(error);
            return response.status(503).json({
                statusCode: 503,
                errorCode: errors.MAILJET_UNAVAILABLE,
                message: `Could not send e-mail to ${user.email}`
            });
        });
    }
};