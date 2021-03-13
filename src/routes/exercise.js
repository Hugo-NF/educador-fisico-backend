/**
 * This file contains all the routes related to the exercise entity
 *
 */

const router = require('express').Router();
const { celebrate } = require('celebrate');

// Importing Controllers
const ExercisesController = require('../controllers/ExercisesController');

// Importing Validations
const { exerciseValidation } = require('../validations/exerciseValidations');
const { idValidation, indexValidation } = require('../validations/utilValidations');

/**
 * @swagger
 * /api/exercise/:id:
 *  get:
 *    description: Show the exercise
 *    responses:
 *      '200':
 *          description: a successful response
 */
router.post('/', celebrate(indexValidation, { abortEarly: false }), ExercisesController.index);
router.post('/create', celebrate(exerciseValidation, { abortEarly: false }), ExercisesController.create);
router.get('/:id', celebrate(idValidation, { abortEarly: false }), ExercisesController.show);
router.put('/:id', celebrate(idValidation, { abortEarly: false }), celebrate(exerciseValidation, { abortEarly: false }), ExercisesController.edit);
router.delete('/:id', celebrate(idValidation, { abortEarly: false }), ExercisesController.delete);

module.exports = router;
