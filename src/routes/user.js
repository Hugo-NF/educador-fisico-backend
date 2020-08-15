/**
 * This file contains all the routes related to the user entity
 *
 */

const router = require('express').Router();
const { celebrate } = require('celebrate');

// Importing Controllers
const UsersController = require('../controllers/UsersController');

// Importing Validations
const {
  loginValidation,
  registerValidation,
  emailRequestValidation,
  tokenForgeryCheckValidation,
  resetPasswordValidation,
} = require('../validations/authValidations');

// Login existing user
router.post('/login', celebrate(loginValidation, { abortEarly: false }), UsersController.login);

// Register new user
router.post('/register', celebrate(registerValidation, { abortEarly: false }), UsersController.create);

// Send password recovery e-mail
router.post('/password/reset', celebrate(emailRequestValidation, { abortEarly: false }), UsersController.sendRecoverEmail);

// Checks reset password token
router.get('/password/reset/:token', celebrate(tokenForgeryCheckValidation, { abortEarly: false }), UsersController.checkPasswordResetToken);

// Reset user password
router.post('/password/reset/:token', celebrate(tokenForgeryCheckValidation, { abortEarly: false }), celebrate(resetPasswordValidation, { abortEarly: false }), UsersController.resetPassword);

// Send account activation e-mail
router.post('/activate', celebrate(emailRequestValidation, { abortEarly: false }), UsersController.sendAccountActivationEmail);

// Activate account
router.get('/activate/:token', celebrate(tokenForgeryCheckValidation, { abortEarly: false }), UsersController.activateAccount);

module.exports = router;
