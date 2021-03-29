/**
 * @swagger
 *   tags:
 *     name: Exercises
 *     description: Routes to manipulate exercises on database
 */

/**
  * @swagger
  * components:
  *   schemas:
  *     ExerciseIndexResponse:
  *       type: object
  *       properties:
  *         statusCode:
  *           type: number
  *           description: HTTP status code
  *           example: 200
  *         count:
  *           type: number
  *           description: Amount of items in page
  *           example: 50
  *         data:
  *           type: object
  *           properties:
  *             exercises:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Exercise'
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
 * /api/exercises:
 *  post:
 *    tags:
 *      - Exercises
 *    summary: Returns a list of exercise
 *    description: Use to request or filter all exercises
 *    security:
 *      - Token: []
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
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Regex pattern to match names.
 *    responses:
 *       200:
 *          description: Search successfull
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ExerciseIndexResponse'
 *
 *       500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', celebrate(indexValidation, { abortEarly: false }), ExercisesController.index);

/**
 * @swagger
 * /api/exercises/create:
 *  post:
 *    tags:
 *      - Exercises
 *    summary: Create a exercise
 *    description: Create a new exercise in database
 *    security:
 *      - Token: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Exercise'
 *    responses:
 *       201:
 *          description: Exercise created and returned.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Exercise'
 *       500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/create', celebrate(exerciseValidation, { abortEarly: false }), ExercisesController.create);

/**
 * @swagger
 * /api/exercises/:id:
 *  get:
 *    tags:
 *      - Exercises
 *    summary: Get an exercise
 *    description: Find a exercise by its ID
 *    security:
 *      - Token: []
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123
 *        required: true
 *        description: The id of the circuit to be showed
 *    responses:
 *       200:
 *          description: Exercise found and returned.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Exercise'
 *       404:
 *          description: Exercise could not be found using id param
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', celebrate(idValidation, { abortEarly: false }), ExercisesController.show);

/**
 * @swagger
 * /api/exercises/:id:
 *  put:
 *    tags:
 *      - Exercises
 *    summary: Edit a exercise
 *    description: Edits an exercise from body params
 *    security:
 *      - Token: []
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123
 *        required: true
 *        description: The id of the exercise to be edited
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Exercise'
 *
 *    responses:
 *       200:
 *          description: Exercise successfully edited and returns the new object.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Exercise'
 *       404:
 *          description: Exercise could not be found using id param
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', celebrate(idValidation, { abortEarly: false }), celebrate(exerciseValidation, { abortEarly: false }), ExercisesController.edit);

/**
 * @swagger
 * /api/exercises/:id:
 *  delete:
 *    tags:
 *      - Exercises
 *    summary: Delete an exercise
 *    description: Delete an exercise by ID
 *    security:
 *      - Token: []
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123
 *        required: true
 *        description: The id of the exercise to be deleted
 *    responses:
 *       200:
 *          description: Exercise successfully deleted and returns it.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Exercise'
 *       404:
 *          description: Exercise could not be found using id param
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', celebrate(idValidation, { abortEarly: false }), ExercisesController.delete);

module.exports = router;
