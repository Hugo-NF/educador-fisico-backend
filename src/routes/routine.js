/**
 * This file contains all the routes related to the routine entity
 *
 */

const router = require('express').Router();
const { celebrate } = require('celebrate');

// Importing Controllers
const RoutinesController = require('../controllers/RoutinesController');

// Importing Validations
const { routineValidation } = require('../validations/routineValidations');
const { idValidation, indexValidation } = require('../validations/utilValidations');

/**
 * @swagger
 * /api/routines/:id:
 *  get:
 *    description: Show the routines
 *    responses:
 *      '200':
 *          description: a successful response
 */
router.post('/', celebrate(indexValidation, { abortEarly: false }), RoutinesController.index);
router.post('/create', celebrate(routineValidation, { abortEarly: false }), RoutinesController.create);
router.get('/:id', celebrate(idValidation, { abortEarly: false }), RoutinesController.show);
router.put('/:id', celebrate(idValidation, { abortEarly: false }), celebrate(routineValidation, { abortEarly: false }), RoutinesController.edit);
router.delete('/:id', celebrate(idValidation, { abortEarly: false }), RoutinesController.delete);

module.exports = router;
