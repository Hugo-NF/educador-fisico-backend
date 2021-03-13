/**
 * @swagger
 *   tags:
 *     name: Circuits
 *     description: Routes to manipulate circuits on database
 */

const router = require('express').Router();
const { celebrate } = require('celebrate');

// Importing Controllers
const CircuitsController = require('../controllers/CircuitsController');

// Importing Validations
const { indexValidation, circuitValidation } = require('../validations/circuitValidations');
const { idValidation } = require('../validations/utilValidations');

/**
 * @swagger
 * /api/circuits:
 *  post:
 *    tags:
 *      - Circuits
 *    summary: Returns a list of circuits
 *    description: Index route to circuits
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
 *       500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', celebrate(indexValidation, { abortEarly: false }), CircuitsController.index);

/**
 * @swagger
 * /api/circuits/create:
 *  post:
 *    tags:
 *      - Circuits
 *    summary: Create a circuit
 *    description: Used to create a circuit
 *    parameters:
 *      - in: body
 *        name: name
 *        schema:
 *          type: string
 *          example: Circuito1
 *        required: true
 *        description: The name of the circuit to be created
 *      - in: body
 *        name: exercises
 *        schema:
 *          type: json
 *          example:
 *              name: Supino
 *              video: youtube.com/url
 *        required: true
 *        description: List of exercises to be in the circuit
 *    responses:
 *      '200':
 *          description: a successful response
 *      '500':
 *          description: Could not create the circuit
 */
router.post('/create', celebrate(circuitValidation, { abortEarly: false }), CircuitsController.create);

/**
 * @swagger
 * /api/circuits/:id:
 *  get:
 *    tags:
 *      - Circuits
 *    summary: Get a circuit
 *    description: Used to get a circuit
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123
 *        required: true
 *        description: The id of the circuit to be got
 *    responses:
 *      '200':
 *          description: a successful response
 *      '500':
 *          description: Could not retrieve circuit
 */
router.get('/:id', celebrate(idValidation, { abortEarly: false }), CircuitsController.show);

/**
 * @swagger
 * /api/circuits/:id:
 *  put:
 *    tags:
 *      - Circuits
 *    summary: edit a circuit
 *    description: Used to edit a circuit
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123
 *        required: true
 *        description: The id of the circuit to be edited
 *      - in: body
 *        name: name
 *        schema:
 *          type: string
 *          example: Circuito2
 *        required: true
 *        description: The new name of the circuit
 *      - in: body
 *        name: exercises
 *        schema:
 *          type: json
 *          example:
 *              name: Supino
 *              video: youtube.com/url
 *        required: true
 *        description: The new list of exercises
 *    responses:
 *       200:
 *          description: a successful response
 *       500:
 *          description: Could not edit the circuit
 */
router.put('/:id', celebrate(idValidation, { abortEarly: false }), celebrate(circuitValidation, { abortEarly: false }), CircuitsController.edit);

/**
 * @swagger
 * /api/circuits/:id:
 *  delete:
 *    tags:
 *      - Circuits
 *    summary: delete a circuit
 *    description: Used to delete a circuit
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123
 *        required: true
 *        description: The id of the circuit to be deleted
 *    responses:
 *       200:
 *          description: a successful response
 *       404:
 *          description: Circuit could not be found
 *       500:
 *          description: Could not delete the circuit
 */
router.delete('/:id', celebrate(idValidation, { abortEarly: false }), CircuitsController.delete);

module.exports = router;
