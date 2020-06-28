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
const { indexValidation, circuitValidation } = require('../validations/circuitValidations');
const { idValidation } = require('../validations/utilValidations');

router.post('/', celebrate(indexValidation), CircuitsController.index);
router.post('/create', celebrate(circuitValidation), CircuitsController.create);
router.get('/:id', celebrate(idValidation), CircuitsController.show);
router.put('/:id', celebrate(idValidation), celebrate(circuitValidation), CircuitsController.edit);
router.delete('/:id', celebrate(idValidation), CircuitsController.delete);

module.exports = router;
