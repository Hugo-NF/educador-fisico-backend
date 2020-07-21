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

/**
 * @swagger
 * /api/circuits:
 *  post:
 *    description: Use to request all circuits
 *    responses:
 *      '200':
 *          description: a successful response
 */
router.post('/', celebrate(indexValidation, { abortEarly: false }), CircuitsController.index);
router.post('/create', celebrate(circuitValidation, { abortEarly: false }), CircuitsController.create);
router.get('/:id', celebrate(idValidation, { abortEarly: false }), CircuitsController.show);
router.put('/:id', celebrate(idValidation, { abortEarly: false }), celebrate(circuitValidation, { abortEarly: false }), CircuitsController.edit);
router.delete('/:id', celebrate(idValidation, { abortEarly: false }), CircuitsController.delete);

module.exports = router;
