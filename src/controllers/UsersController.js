const UIDGenerator = require('uid-generator');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const logger = require('../config/configLogging');
const errors = require('../config/errorsEnum');

const mailer = require('../services/mailjet');
const emailTemplate = require('../../emails/linkAndText');

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
                    active: user.emailConfirmed,
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
            return response.status(exc.code == 11000 ? 400 : 500).json({
                statusCode: exc.code == 11000 ? 400 : 500,
                errorCode: exc.code == 11000 ? errors.VALIDATION_ERROR : errors.UNKNOWN_ERROR,
                message: "Could not register a new user",
                error: exc
            });
        }
    },

    // Send password reset e-mail
    async sendRecoverEmail(request, response) {
        const { email } = request.body;
        const currentUTC = new Date(new Date().toUTCString());

        const user = User.findOne({ email: email });
        if(!user) {
            return response.status(409).json({
                statusCode: 409,
                errorCode: errors.USER_NOT_IN_DATABASE,
                message: "User is not in database"
            });
        }
        else if(user.lockoutUntil > currentUTC && user.lockoutReason != 'ACCESS_FAILED' && user.lockoutReason != null) {
            return response.status(401).json({
                statusCode: 401,
                errorCode: errors.ACCOUNT_LOCK_OUT,
                message: "This account is locked"
            });
        }

        // TODO: Replace e-mail info with real data as soon as available

        // Generating password reset token
        const uidgen = new UIDGenerator();
        const token = await uidgen.generate();
        
        const tokenExpiration = parseInt(process.env.RESET_PASSWORD_EXPIRATION); // In minutes
        currentUTC.setMinutes(currentUTC.getMinutes() + tokenExpiration);

        const resetUrl = `${process.env.REACTAPP_HOST}/account/password_reset/${token}`;

        // Updating user in database
        await user.update({
            resetPasswordToken: token,
            resetPasswordTokenExpiration: currentUTC
        });

        // Generating e-mail
        const content = await emailTemplate.render(
            "https://mdbootstrap.com/img/logo/mdb-email.png",
            "https://mdbootstrap.com/img/Mockups/Lightbox/Original/img (67).jpg",
            "Password Recovery Process",
            "Here is your password reset token",
            "Password Recovery Process",
            `Click on the button below to reset your password, or use this link in case the button doesn't work: ${resetUrl}`,
            "Reset my password",
            resetUrl,
            "This is an automatic e-mail, do NOT respond",
            process.env.APP_NAME
        );

        // Dispatch e-mail
        mailer.sendEmails([{"Email": email, "Name": user.name}], "Password Recovery Process", content)
        .then((result) => {
            console.log(result);
            return response.json({
                statusCode: 200,
                message: `E-mail sent successfully`
            });
        })
        .catch((error) => {
            console.log(error);
            return response.status(503).json({
                statusCode: 503,
                errorCode: errors.MAILJET_UNAVAILABLE,
                message: `Could not send e-mail`
            });
        });
    },

    // Checks the validity of the token
    async checkPasswordResetToken(request, response) {
        const { token } = request.params;
        const currentUTC = new Date(new Date().toUTCString());

        const user = User.findOne({resetPasswordToken: token});
        if(!user) {
            return response.status(409).json({
                statusCode: 409,
                errorCode: errors.TOKEN_NOT_GENERATED,
                message: "Requested token was not emitted or active"
            });
        }
        else if(user.resetPasswordTokenExpiration > currentUTC) {
            return response.status(403).json({
                statusCode: 403,
                errorCode: errors.TOKEN_NOT_GENERATED,
                message: "Token is expired or already used"
            });
        }
        else {
            return response.json({
                statusCode: 200,
                message: "Token is active",
                data: {
                    user: {
                        name: user.name,
                        email: user.email
                    }
                }
            });
        }
    },

    async resetPassword(request, response) {
        const { token } = request.params;
        const { password } = request.body;

        const currentUTC = new Date(new Date().toUTCString());

        const user = User.findOne({resetPasswordToken: token});
        if(!user) {
            return response.status(409).json({
                statusCode: 409,
                errorCode: errors.TOKEN_NOT_GENERATED,
                message: "Requested token was not emitted or active"
            });
        }
        else if(user.resetPasswordTokenExpiration > currentUTC) {
            return response.status(403).json({
                statusCode: 403,
                errorCode: errors.TOKEN_NOT_GENERATED,
                message: "Token is expired or was already used"
            });
        }
        else {
            try {
                await user.update({
                    resetPasswordTokenExpiration: currentUTC,
                    password: password
                });

                return response.json({
                    statusCode: 200,
                    message: "Password successfully reset"
                });
            }
            catch(error) {
                return response.status(500).json({
                    statusCode: 500,
                    errorCode: errors.UNKNOWN_ERROR,
                    message: "An unknown error occured. Open server logs for depuration"
                });
            }
        }
    },

    async sendAccountActivationEmail(request, response) {
        const { email } = request.body;
        const currentUTC = new Date(new Date().toUTCString());

        const user = User.findOne({ email: email });
        if(!user) {
            return response.status(409).json({
                statusCode: 409,
                errorCode: errors.USER_NOT_IN_DATABASE,
                message: "User is not in database"
            });
        }
        else if(user.lockoutUntil > currentUTC && user.lockoutReason != null) {
            return response.status(401).json({
                statusCode: 401,
                errorCode: errors.ACCOUNT_LOCK_OUT,
                message: "This account is locked"
            });
        }

        // TODO: Replace e-mail info with real data as soon as available

        // Generating password reset token
        const uidgen = new UIDGenerator();
        const token = await uidgen.generate();
        
        const tokenExpiration = parseInt(process.env.ACCOUNT_ACTIVATION_EXPIRATION); // In minutes
        currentUTC.setMinutes(currentUTC.getMinutes() + tokenExpiration);

        const activationUrl = `${process.env.REACTAPP_HOST}/account/activation/${token}`;

        // Updating user in database
        await user.update({
            emailConfirmationToken: token,
            emailConfirmationTokenExpiration: currentUTC
        });

        // Generating e-mail
        const content = await emailTemplate.render(
            "https://mdbootstrap.com/img/logo/mdb-email.png",
            "https://mdbootstrap.com/img/Mockups/Lightbox/Original/img (67).jpg",
            "Confirm Your Account",
            "Thank you for subscribing on our platform",
            "Confirm your account",
            `Click on the button below to activate your account, or use this link in case the button doesn't work: ${activationUrl}`,
            "Reset my password",
            activationUrl,
            "This is an automatic e-mail, do NOT respond",
            process.env.APP_NAME
        );

        // Dispatch e-mail
        mailer.sendEmails([{"Email": email, "Name": user.name}], "Confirm Your Account", content)
        .then((result) => {
            console.log(result);
            return response.json({
                statusCode: 200,
                message: `E-mail sent successfully`
            });
        })
        .catch((error) => {
            console.log(error);
            return response.status(503).json({
                statusCode: 503,
                errorCode: errors.MAILJET_UNAVAILABLE,
                message: `Could not send e-mail`
            });
        });
    },

    async activateAccount(request, response) {
        const { token } = request.params;
        const currentUTC = new Date(new Date().toUTCString());

        const user = User.findOne({emailConfirmationToken: token});
        if(!user) {
            return response.status(409).json({
                statusCode: 409,
                errorCode: errors.TOKEN_NOT_GENERATED,
                message: "Requested token was not emitted or active"
            });
        }
        else if(user.emailConfirmationTokenExpiration > currentUTC) {
            return response.status(403).json({
                statusCode: 403,
                errorCode: errors.TOKEN_NOT_GENERATED,
                message: "Token is expired or already used"
            });
        }
        else {
            try {
                await user.update({
                    emailConfirmationTokenExpiration: currentUTC,
                    emailConfirmed: true
                });

                return response.json({
                    statusCode: 200,
                    message: "Password successfully reset"
                });
            }
            catch(error) {
                return response.status(500).json({
                    statusCode: 500,
                    errorCode: errors.UNKNOWN_ERROR,
                    message: "An unknown error occured. Open server logs for depuration"
                });
            }
        }
    }
};