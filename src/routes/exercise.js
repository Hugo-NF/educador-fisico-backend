/**
 * This file contains all the routes related to the exercise entity
 *
 */

const router = require('express').Router();
const { celebrate } = require('celebrate');

// Importing Controllers
const ExercisesController = require('../controllers/ExercisesController');

// Importing Validations
const { createValidation, editValidation, deleteValidation } = require('../validations/exerciseValidations');

router.get('/index', ExercisesController.index);
router.post('/create', celebrate(createValidation), ExercisesController.create);
router.get('/:id', ExercisesController.show);
router.put('/:id', celebrate(editValidation), ExercisesController.edit);
router.delete('/:id', celebrate(deleteValidation), ExercisesController.delete);

module.exports = router;
