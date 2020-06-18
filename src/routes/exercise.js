/**
 * This file contains all the routes related to the exercise entity
 * 
 */

const router = require('express').Router();
const { celebrate } = require('celebrate');

// const helpers = require('../helpers/ExercisesHelper');

// Importing Controllers
const ExercisesController = require('../controllers/ExercisesController');

// Importing Validations
const { createValidation, indexValidation, showValidation, editValidation, deleteValidation } = require('../validations/exercisesValidations');

router.post('/create', celebrate(createValidation), ExercisesController.create);
router.post('/index', celebrate(indexValidation), ExercisesController.index);
router.get('/:id', celebrate(showValidation), ExercisesController.show);
router.put('/:id', celebrate(editValidation), ExercisesController.edit);
router.delete('/:id', celebrate(deleteValidation), ExercisesController.delete);


module.exports = router;