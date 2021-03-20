const router = require('express').Router();
const { celebrate } = require('celebrate');

// Importing Controllers
const ExercisesController = require('../controllers/ExercisesController');

// Importing Validations
const { exerciseValidation } = require('../validations/exerciseValidations');
const { idValidation, indexValidation } = require('../validations/utilValidations');

/**
 * @swagger
 * /api/exercises:
 *  post:
 *    tags:
 *      - exercise
 *    summary: Returns a list of exercise
 *    description: Use to request all exercise
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          example: 1
 *        required: false
 *        description: The page wanted to be shown
 *      - in: query
 *        name: max
 *        schema:
 *          type: integer
 *          example: 5
 *        required: false
 *        description: The max results wanted to be shown
 *      - in: body
 *        name: name
 *        schema:
 *          type: string
 *          example: Exercicio1
 *        required: false
 *        description: The name of the exercise wanted to be shown
 *    responses:
 *      '200':
 *          description: a successful response
 *      '500':
 *          description: Could not retrieve the exercise
 */
router.post('/', celebrate(indexValidation, { abortEarly: false }), ExercisesController.index);
/**
 * @swagger
 * /api/exercises/create:
 *  post:
 *    tags:
 *      - exercise
 *    summary: Create a exercise
 *    description: Used to create a exercise
 *    parameters:
 *      - in: body
 *        name: name
 *        schema:
 *          type: string
 *          example: Exercicio1
 *        required: true
 *        description: The name of the exercise to be created
 *      - in: body
 *        name: video
 *        schema:
 *          type: string
 *          example: youtube.com/url
 *        required: false
 *        description: url of the video
 *    responses:
 *      '200':
 *          description: a successful response
 *      '500':
 *          description: Could not create the exercise
 */
router.post('/create', celebrate(exerciseValidation, { abortEarly: false }), ExercisesController.create);
/**
 * @swagger
 * /api/exercises/:id:
 *  get:
 *    tags:
 *      - exercise
 *    summary: Get an exercise
 *    description: Used to get an exercise
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123
 *        required: true
 *        description: The id of the circuit to be showed
 *    responses:
 *      '200':
 *          description: a successful response
 *      '404':
 *          description: Exercise could not be found
 *      '500':
 *          description: Could not retrieve exercise
 */
router.get('/:id', celebrate(idValidation, { abortEarly: false }), ExercisesController.show);
/**
 * @swagger
 * /api/exercises/:id:
 *  put:
 *    tags:
 *      - exercise
 *    summary: edit a exercise
 *    description: Used to edit a exercise
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123
 *        required: true
 *        description: The id of the exercise to be edited
 *      - in: body
 *        name: name
 *        schema:
 *          type: string
 *          example: Supino
 *        required: true
 *        description: The new name of the exercise
 *      - in: body
 *        name: video
 *        schema:
 *          type: String
 *          example: youtube.com/url
 *        required: false
 *        description: url of the video
 *    responses:
 *      '200':
 *          description: a successful response
 *      '404':
 *          description: Exercise could not be found
 *      '500':
 *          description: Could not edit exercise
 */
router.put('/:id', celebrate(idValidation, { abortEarly: false }), celebrate(exerciseValidation, { abortEarly: false }), ExercisesController.edit);
/**
 * @swagger
 * /api/exercises/:id:
 *  delete:
 *    tags:
 *      - exercise
 *    summary: Delete an exercise
 *    description: Used to delete an exercise
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123
 *        required: true
 *        description: The id of the circuit to be deleted
 *    responses:
 *      '200':
 *          description: a successful response
 *      '404':
 *          description: Exercise could not be found
 *      '500':
 *          description: Could not delete the exercise
 */
router.delete('/:id', celebrate(idValidation, { abortEarly: false }), ExercisesController.delete);

module.exports = router;
