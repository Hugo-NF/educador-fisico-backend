/**
 * @swagger
 *   tags:
 *     name: Routines
 *     description: Routes to manipulate routines on database
 */

/**
  * @swagger
  * components:
  *   schemas:
  *     RoutineIndexResponse:
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
  *             routines:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Routine'
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
 * /api/routines:
 *  post:
 *    tags:
 *      - Routines
 *    summary: Returns a list of routines
 *    description: Index route to routines
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
 *          example: 50
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
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/RoutineIndexResponse'
 *
 *       500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', celebrate(indexValidation, { abortEarly: false }), RoutinesController.index);

/**
 * @swagger
 * /api/routines/create:
 *  post:
 *    tags:
 *      - Routines
 *    summary: Create a routine
 *    description: Create a new routine in database
 *    security:
 *      - Token: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Routine'
 *    responses:
 *       201:
 *          description: Routine created and returned.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Routine'
 *       500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/create', celebrate(routineValidation, { abortEarly: false }), RoutinesController.create);

/**
 * @swagger
 * /api/routines/:id:
 *  get:
 *    tags:
 *      - Routines
 *    summary: Get an routine
 *    description: Find a routine by its ID
 *    security:
 *      - Token: []
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123
 *        required: true
 *        description: The id of the routine to be showed
 *    responses:
 *       200:
 *          description: Routine found and returned.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Routine'
 *       404:
 *          description: Routine could not be found using id param
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
router.get('/:id', celebrate(idValidation, { abortEarly: false }), RoutinesController.show);

/**
 * @swagger
 * /api/routines/:id:
 *  put:
 *    tags:
 *      - Routine
 *    summary: Edit a routine
 *    description: Edits an routine from body params
 *    security:
 *      - Token: []
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123
 *        required: true
 *        description: The id of the routine to be edited
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Routine'
 *
 *    responses:
 *       200:
 *          description: Routine successfully edited and returns the new object.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Routine'
 *       404:
 *          description: Routine could not be found using id param
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
router.put('/:id', celebrate(idValidation, { abortEarly: false }), celebrate(routineValidation, { abortEarly: false }), RoutinesController.edit);

/**
 * @swagger
 * /api/routines/:id:
 *  delete:
 *    tags:
 *      - Routines
 *    summary: Delete an routine
 *    description: Delete an routine by ID
 *    security:
 *      - Token: []
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123
 *        required: true
 *        description: The id of the routine to be deleted
 *    responses:
 *       200:
 *          description: Routine successfully deleted and returns it.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Routine'
 *       404:
 *          description: Routine could not be found using id param
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
router.delete('/:id', celebrate(idValidation, { abortEarly: false }), RoutinesController.delete);

module.exports = router;
