/**
 * This file contains all the routes related to the user entity
 * 
 */

const router = require('express').Router();
const { celebrate } = require('celebrate');

const helpers = require('../helpers/UsersHelper');

// Importing Controllers
const UsersController = require('../controllers/UsersController');

// Importing Validations
const { 
    loginValidation,
    registerValidation, 
    emailRequestValidation,
    tokenForgeryCheckValidation,
    resetPasswordValidation
} = require('../validations/authValidations');

// Login existing user
router.post('/login', celebrate(loginValidation), UsersController.login);

// Register new user
router.post('/register', celebrate(registerValidation), UsersController.create);

// Send password recovery e-mail
router.post('/password/reset', celebrate(emailRequestValidation), UsersController.sendRecoverEmail);

// Checks reset password token
router.get('/password/reset/:token', celebrate(tokenForgeryCheckValidation), UsersController.checkPasswordResetToken);

// Reset user password
router.post('/password/reset/:token', celebrate(tokenForgeryCheckValidation), celebrate(resetPasswordValidation), UsersController.resetPassword);

// Send account activation e-mail
router.post('/activate', celebrate(emailRequestValidation), UsersController.sendAccountActivationEmail);

// Activate account
router.get('/activate/:token', celebrate(tokenForgeryCheckValidation), UsersController.activateAccount);


module.exports = router;