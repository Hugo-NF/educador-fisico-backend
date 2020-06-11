/**
 * This file contains all the routes related to the user entity
 * 
 */

const router = require('express').Router();

const UsersController = require('../controllers/UsersController');

router.post('/login', UsersController.login);
router.post('/register', UsersController.create);

module.exports = router;