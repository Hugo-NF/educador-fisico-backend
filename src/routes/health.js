/**
 * This file contains all the routes related to the user entity
 *
 */

const router = require('express').Router();
const { celebrate } = require('celebrate');

// Importing Controllers
const HealthController = require('../controllers/HealthController');

// Importing Validations
const { healthValidation } = require('../validations/healthValidations');
const { idValidation, dateSpanValidation } = require('../validations/utilValidations');

router.post('/create', celebrate(idValidation), celebrate(healthValidation), HealthController.create);
router.post('/', celebrate(idValidation), celebrate(dateSpanValidation), HealthController.show);
router.delete('/', celebrate(idValidation), HealthController.delete);

module.exports = router;
