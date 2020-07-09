/**
 * This file contains all the routes related to the user entity
 *
 */

const router = require('express').Router();
const { celebrate } = require('celebrate');

// Importing Controllers
const HealthController = require('../controllers/HealthController');

// Importing Validations
const { indexValidation, healthValidation } = require('../validations/healthValidations');
const { idValidation } = require('../validations/utilValidations');

router.post('/', celebrate(indexValidation), HealthController.index);
router.post('/create', celebrate(healthValidation), HealthController.create);
router.get('/:id', celebrate(idValidation), HealthController.show);
router.put('/:id', celebrate(idValidation), celebrate(healthValidation), HealthController.edit);
router.delete('/:id', celebrate(idValidation), HealthController.delete);

module.exports = router;
