/**
 * This file contains all the routes related to the volume entity
 *
 */

const router = require('express').Router();
const { celebrate } = require('celebrate');

// const helpers = require('../helpers/VolumeHelper');

// Importing Controllers
const CircuitsController = require('../controllers/CircuitsController');

// Importing Validations
const { createValidation, editValidation, idValidation } = require('../validations/circuitValidations');

router.post('/', CircuitsController.index);
router.post('/create', CircuitsController.create);
router.get('/:id', CircuitsController.show);
router.put('/:id', CircuitsController.edit);
router.delete('/:id', CircuitsController.delete);

module.exports = router;
