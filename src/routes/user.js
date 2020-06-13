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
const { registerValidation, loginValidation } = require('../validations/authValidations');

router.post('/login', celebrate(loginValidation), UsersController.login);
router.post('/register', celebrate(registerValidation), UsersController.create);


module.exports = router;