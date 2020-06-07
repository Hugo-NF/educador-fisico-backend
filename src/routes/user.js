/**
 * This file contains all the routes related to the user entity
 * 
 */

const router = require('express').Router();

const UsersController = require('../controllers/UsersController');

router.post('/register', UsersController.create);

module.exports = router;