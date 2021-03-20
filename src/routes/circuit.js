/**
 * @swagger
 *   tags:
 *     name: Circuits
 *     description: Routes to manipulate circuits on database
 */

/**
  * @swagger
  * components:
  *   schemas:
  *     IndexResponse:
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
  *             circuits:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Circuit'
  */

const router = require('express').Router();
const { celebrate } = require('celebrate');

// Importing Controllers
const CircuitsController = require('../controllers/CircuitsController');

// Importing Validations
const { circuitValidation } = require('../validations/circuitValidations');
const { idValidation, indexValidation } = require('../validations/utilValidations');

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
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/IndexResponse'
 *
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
 *    summary: Create a new circuit
 *    description: Create a new circuit using exercises from the database
 *    security:
 *      - Token: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Circuit'
 *
 *    responses:
 *       201:
 *          description: Circuit created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Circuit'
 *       500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/create', celebrate(circuitValidation, { abortEarly: false }), CircuitsController.create);

/**
 * @swagger
 * /api/circuits/:id:
 *  get:
 *    tags:
 *      - Circuits
 *    summary: Get a circuit
 *    description: Retrieve a circuit by id
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123
 *        required: true
 *        description: The id of the circuit to be retrieved
 *    responses:
 *       200:
 *          description: Circuit found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Circuit'
 *       404:
 *          description: Circuit could not be found using id param
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
router.get('/:id', celebrate(idValidation, { abortEarly: false }), CircuitsController.show);

/**
 * @swagger
 * /api/circuits/:id:
 *  put:
 *    tags:
 *      - Circuits
 *    summary: Edits a circuit
 *    description: Edits a circuit using it's id
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123
 *        required: true
 *        description: The id of the circuit to be edited
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Circuit'
 *    responses:
 *       200:
 *          description: Circuit successfully edited
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Circuit'
 *       404:
 *          description: Circuit could not be found using id param
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
router.put('/:id', celebrate(idValidation, { abortEarly: false }), celebrate(circuitValidation, { abortEarly: false }), CircuitsController.edit);

/**
 * @swagger
 * /api/circuits/:id:
 *  delete:
 *    tags:
 *      - Circuits
 *    summary: Delete a circuit
 *    description: Delete a circuit by id
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
 *          description: Circuit successfully deleted and returns it.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Circuit'
 *       404:
 *          description: Circuit could not be found using id param
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
router.delete('/:id', celebrate(idValidation, { abortEarly: false }), CircuitsController.delete);

module.exports = router;
