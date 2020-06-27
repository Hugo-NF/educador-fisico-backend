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
    logger.info('Inbound request to /users/login');
    const currentUTC = new Date();

    const { email, password } = request.body;

    try {
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        logger.warn(`An unregistered e-mail (${email}) tried to log in`);

        return response.status(409).json({
          statusCode: 409,
          errorCode: errors.USER_NOT_IN_DATABASE,
          message: 'User is not in database',
        });
      }

      // Check lockout
      if (user.lockoutUntil > currentUTC) {
        logger.warn(`A blocked/banned user (${email}) tried to log in`);

        return response.status(401).json({
          statusCode: 401,
          errorCode: errors.ACCOUNT_LOCK_OUT,
          message: `Your account is locked until ${user.lockoutUntil}`,
          error: {
            lockoutReason: user.lockoutReason,
          },
        });
      }

      // Check password
      const passwordCorrect = await bcrypt.compare(password, user.password);
      if (!passwordCorrect) {
        logger.warn(`User (${email}) typed wrong password. Updating lockout settings`);

        // Update lockout settings
        const lockout = await updateLockout(user, currentUTC);
        return response.status(lockout.statusCode).json(lockout);
      }

      // Resets lockout count
      if (user.accessFailedCount !== 0) await user.updateOne({ accessFailedCount: 0 });

      const authToken = await generateJWT(user);

      logger.info(`User ${email} logged in successfully`);
      return response.json({
        statusCode: 200,
        message: 'Logged in successfully',
        data: {
          name: user.name,
          email: user.email,
          active: user.emailConfirmed,
          'auth-token': authToken,
        },
      });
    } catch (exc) {
      return response.status(500).json({
        statusCode: 500,
        message: 'Login unavailable',
        error: exc,
      });
    }
  },

  // Register method
  async create(request, response) {
    logger.info('Inbound request to /users/register');

    const {
      name, email, password, birthDate, sex, phones, city, state,
    } = request.body;

    try {
      const user = new User({
        name, email, password, birthDate, sex, phones, city, state,
      });
      const role = await Role.findOne({ name: 'Student' });

      user._id = uuidv4();
      user.roles = [role._id];
      await user.save();

      logger.info(`A new user with e-mail (${email}) was registered`);
      return response.json({
        statusCode: 200,
        data: {
          _id: user._id,
        },
      });
    } catch (exc) {
      if (Object.prototype.hasOwnProperty.call(exc, 'driver')) {
        logger.warn(`Someone tried to register the e-mail (${email}) again`);

        return response.status(400).json({
          statusCode: 400,
          errorCode: errors.DATABASE_CONFLICT,
          message: 'User info uniqueness conflict',
          error: exc,
        });
      }

      logger.error(`An unforeseen exception occurred: Details: ${exc}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: 'Could not register a new user',
        error: exc,
      });
    }
  },

  // Send password reset e-mail
  async sendRecoverEmail(request, response) {
    logger.info('Inbound request to /users/password/reset');
    const { email, sandboxMode = false } = request.body;
    const currentUTC = new Date();

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`An unregistered e-mail (${email}) tried to get password reset token`);
      return response.status(409).json({
        statusCode: 409,
        errorCode: errors.USER_NOT_IN_DATABASE,
        message: 'User is not in database',
      });
    }
    if (user.lockoutUntil > currentUTC && user.lockoutReason !== 'ACCESS_FAILED' && user.lockoutReason !== null) {
      logger.warn(`A blocked/banned user (${email}) tried to get password reset token`);

      return response.status(401).json({
        statusCode: 401,
        errorCode: errors.ACCOUNT_LOCK_OUT,
        message: 'This account is locked',
      });
    }

    // TODO: Replace e-mail info with real data as soon as available

    // Generating password reset token
    const uidgen = new UIDGenerator();
    const token = await uidgen.generate();

    const tokenExpiration = parseInt(process.env.RESET_PASSWORD_EXPIRATION, 10); // In minutes
    currentUTC.setMinutes(currentUTC.getMinutes() + tokenExpiration);

    const resetUrl = `${process.env.REACTAPP_HOST}/account/password_reset/${token}`;

    // Updating user in database
    await user.updateOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiration: currentUTC,
    });
    logger.info(`Password reset token generated to account (${email})`);

    // Generating e-mail
    const content = await emailTemplate.render(
      'https://mdbootstrap.com/img/logo/mdb-email.png',
      'https://mdbootstrap.com/img/Mockups/Lightbox/Original/img (67).jpg',
      'Password Recovery Process',
      'Here is your password reset token',
      'Password Recovery Process',
      `Click on the button below to reset your password, or use this link in case the button doesn't work: ${resetUrl}`,
      'Reset my password',
      resetUrl,
      'This is an automatic e-mail, do NOT respond',
      process.env.APP_NAME,
    );

    // Dispatch e-mail
    mailer.sendEmails([{ Email: email, Name: user.name }], 'Password Recovery Process', content, sandboxMode)
      .then((result) => {
        logger.info(`E-mail with password reset token sent successfully to account (${email})`);

        return response.json({
          statusCode: 200,
          message: 'E-mail sent successfully',
        });
      })
      .catch((error) => {
        logger.error(`E-mail with password reset token failed to send to (${email})`);

        return response.status(503).json({
          statusCode: 503,
          errorCode: errors.MAILJET_UNAVAILABLE,
          message: 'Could not send e-mail',
        });
      });
  },

  // Checks the validity of the token
  async checkPasswordResetToken(request, response) {
    logger.info('Inbound request to GET /users/password/reset/:token');

    const { token } = request.params;
    const currentUTC = new Date();

    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) {
      logger.warn(`Validation checked for unrecognized token: ${token}`);

      return response.status(409).json({
        statusCode: 409,
        errorCode: errors.TOKEN_NOT_GENERATED,
        message: 'Requested token was not emitted or active',
      });
    }
    if (user.resetPasswordTokenExpiration <= currentUTC) {
      logger.warn(`User (${user.email}) tried to use invalid password reset token`);

      return response.status(403).json({
        statusCode: 403,
        errorCode: errors.TOKEN_EXPIRED,
        message: 'Token is expired or already used',
      });
    }

    logger.info(`User (${user.email}) checked a valid password reset token`);

    return response.json({
      statusCode: 200,
      message: 'Token is active',
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
      },
    });
  },

  // Reset user password given valid token
  async resetPassword(request, response) {
    logger.info('Inbound request to POST /users/password/reset/:token');

    const { token } = request.params;
    const { password, sandboxMode = false } = request.body;

    const currentUTC = new Date();

    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) {
      logger.warn(`Validation checked for unrecognized token: ${token}`);

      return response.status(409).json({
        statusCode: 409,
        errorCode: errors.TOKEN_NOT_GENERATED,
        message: 'Requested token was not emitted or active',
      });
    }
    if (user.resetPasswordTokenExpiration <= currentUTC) {
      logger.warn(`User (${user.email}) tried to use invalid password reset token`);

      return response.status(403).json({
        statusCode: 403,
        errorCode: errors.TOKEN_EXPIRED,
        message: 'Token is expired or was already used',
      });
    }

    try {
      await user.updateOne({
        resetPasswordTokenExpiration: currentUTC,
        password,
      });

      // TODO: Replace e-mail info with real data as soon as available
      // Generating e-mail
      const challengeUrl = `${process.env.REACTAPP_HOST}/account/password_reset/challenge/${token}`;

      const content = await emailTemplate.render(
        'https://mdbootstrap.com/img/logo/mdb-email.png',
        null,
        'Your password was successfully reset',
        'Recently, the password for your account was successfully reset. If it was you, just ignore this e-mail',
        'Your password was successfully reset',
        `Recently, the password for your account was successfully reset. If it was you, just ignore this e-mail. In case it was NOT, click on the button below or use this link: ${challengeUrl}`,
        'I WILL NOT USE WEAK PASSWORDS EVER MORE',
        challengeUrl,
        'This is an automatic e-mail, do NOT respond',
        process.env.APP_NAME,
      );

      // Dispatch e-mail
      mailer.sendEmails([{ Email: user.email, Name: user.name }], 'Your password was successfully reset', content, sandboxMode)
        .then((result) => {
          logger.info(`E-mail notifying password reset sent successfully to account (${user.email})`);
        })
        .catch((error) => {
          logger.error(`E-mail notifying password reset failed to send to (${user.email}). Details: ${error}`);
        });

      logger.info(`User (${user.email}) updated password successfully`);
      return response.json({
        statusCode: 200,
        message: 'Password successfully reset',
      });
    } catch (error) {
      logger.error(`An unforeseen exception occurred while ${user.email} was trying to reset password. Details: ${error}`);
      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: 'An unknown error occured. Open server logs for depuration',
      });
    }
  },

  // Send account activation e-mail
  async sendAccountActivationEmail(request, response) {
    logger.info('Inbound request to POST /users/activate/:token');

    const { email, sandboxMode = false } = request.body;
    const currentUTC = new Date();

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`An unregistered e-mail (${email}) tried to activate account`);

      return response.status(409).json({
        statusCode: 409,
        errorCode: errors.USER_NOT_IN_DATABASE,
        message: 'User is not in database',
      });
    }
    if (user.lockoutUntil > currentUTC && user.lockoutReason != null) {
      logger.warn(`A banned/blocked user (${email}) tried to activate account`);

      return response.status(401).json({
        statusCode: 401,
        errorCode: errors.ACCOUNT_LOCK_OUT,
        message: 'This account is locked',
      });
    }

    // TODO: Replace e-mail info with real data as soon as available

    // Generating password reset token
    const uidgen = new UIDGenerator();
    const token = await uidgen.generate();

    const tokenExpiration = parseInt(process.env.ACCOUNT_ACTIVATION_EXPIRATION, 10); // In minutes
    currentUTC.setMinutes(currentUTC.getMinutes() + tokenExpiration);

    const activationUrl = `${process.env.REACTAPP_HOST}/account/activation/${token}`;

    // Updating user in database
    await user.updateOne({
      emailConfirmationToken: token,
      emailConfirmationTokenExpiration: currentUTC,
    });
    logger.info(`Account confirmation token generated to account (${email})`);

    // Generating e-mail
    const content = await emailTemplate.render(
      'https://mdbootstrap.com/img/logo/mdb-email.png',
      'https://mdbootstrap.com/img/Mockups/Lightbox/Original/img (67).jpg',
      'Confirm Your Account',
      'Thank you for subscribing on our platform',
      'Confirm your account',
      `Click on the button below to activate your account, or use this link in case the button doesn't work: ${activationUrl}`,
      'Reset my password',
      activationUrl,
      'This is an automatic e-mail, do NOT respond',
      process.env.APP_NAME,
    );

    // Dispatch e-mail
    mailer.sendEmails([{ Email: email, Name: user.name }], 'Confirm Your Account', content, sandboxMode)
      .then((result) => {
        logger.info(`E-mail with account activation token sent successfully to account (${email})`);

        return response.json({
          statusCode: 200,
          message: 'E-mail sent successfully',
        });
      })
      .catch((error) => {
        logger.error(`E-mail with account activation token failed to send to (${email}). Details: ${error}`);

        return response.status(503).json({
          statusCode: 503,
          errorCode: errors.MAILJET_UNAVAILABLE,
          message: 'Could not send e-mail',
        });
      });
  },

  // Activate account given valid token
  async activateAccount(request, response) {
    logger.info('Inbound request to /users/activate');

    const { token } = request.params;
    const { sandboxMode = false } = request.query;

    const currentUTC = new Date();

    const user = await User.findOne({ emailConfirmationToken: token });

    if (!user) {
      logger.warn(`Validation checked for unrecognized token: ${token}`);

      return response.status(409).json({
        statusCode: 409,
        errorCode: errors.TOKEN_NOT_GENERATED,
        message: 'Requested token was not emitted or active',
      });
    }
    if (user.emailConfirmationTokenExpiration <= currentUTC) {
      logger.warn(`User (${user.email}) tried to use invalid account activation token`);

      return response.status(403).json({
        statusCode: 403,
        errorCode: errors.TOKEN_EXPIRED,
        message: 'Token is expired or already used',
      });
    }

    try {
      await user.updateOne({
        emailConfirmationTokenExpiration: currentUTC,
        emailConfirmed: true,
      });

      // TODO: Replace e-mail info with real data as soon as available
      // Generating e-mail
      const welcomeUrl = `${process.env.REACTAPP_HOST}/auth/login`;

      const content = await emailTemplate.render(
        'https://mdbootstrap.com/img/logo/mdb-email.png',
        null,
        `Welcome to ${process.env.APP_NAME}, your workout companion`,
        "Congrats! You're now part of a fantastic project among with a bunch of fantastic people, all of them hunting a healthier life",
        `Welcome to ${process.env.APP_NAME}, your workout companion`,
        `Congrats! You're now part of a fantastic project among with a bunch of fantastic people, all of them hunting a healthier life. Let's start exploring! Login to your brand new account: ${welcomeUrl}`,
        "Let's Go",
        welcomeUrl,
        'This is an automatic e-mail, do NOT respond',
        process.env.APP_NAME,
      );

      // Dispatch e-mail
      mailer.sendEmails([{ Email: user.email, Name: user.name }], `Welcome to ${process.env.APP_NAME}, your workout companion`, content, sandboxMode)
        .then((result) => {
          logger.info(`Welcome e-mail sent successfully to account (${user.email})`);
        })
        .catch((error) => {
          logger.error(`Welcome e-mail failed to send to (${user.email}). Details: ${error}`);
        });

      logger.info(`User (${user.email}) activated account successfully`);
      return response.json({
        statusCode: 200,
        message: 'Account successfully activated',
      });
    } catch (error) {
      logger.error(`An unforeseen exception occurred while ${user.email} was trying to activate account. Details: ${error}`);

      return response.status(500).json({
        statusCode: 500,
        errorCode: errors.UNKNOWN_ERROR,
        message: 'An unknown error occured. Open server logs for depuration',
      });
    }
  },
};
