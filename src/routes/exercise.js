/**
 * This file contains all the routes related to the exercise entity
 *
 */

const router = require('express').Router();
const { celebrate } = require('celebrate');

// Importing Controllers
const ExercisesController = require('../controllers/ExercisesController');

// Importing Validations
const { indexValidation, exerciseValidation } = require('../validations/exerciseValidations');
const { idValidation } = require('../validations/utilValidations');

router.post('/', celebrate(indexValidation), ExercisesController.index);
router.post('/create', celebrate(exerciseValidation), ExercisesController.create);
router.get('/:id', celebrate(idValidation), ExercisesController.show);
router.put('/:id', celebrate(idValidation), celebrate(exerciseValidation), ExercisesController.edit);
router.delete('/:id', celebrate(idValidation), ExercisesController.delete);

module.exports = router;
