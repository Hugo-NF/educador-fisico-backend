/**
 * @swagger
 *   tags:
 *     name: Health
 *     description: Routes to manipulate user's health stats checkpoints
 */

const router = require('express').Router();
const { celebrate } = require('celebrate');

// Importing Controllers
const HealthController = require('../controllers/HealthController');

// Importing Validations
const { healthValidation } = require('../validations/healthValidations');
const { idValidation, dateSpanValidation } = require('../validations/utilValidations');

/**
 * @swagger
 * /api/health/create:
 *  post:
 *    tags:
 *      - Health
 *    summary: Create a health checkpoint
 *    description: Insert a new checkpoint in user profile
 *    security:
 *      - Token: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Health'
 *    responses:
 *       201:
 *          description: Checkpoint successfully added
 *          content:
 *            application/json:
 *              schema:
 *                properties:
 *                  statusCode:
 *                    type: number
 *                    description: HTTP status code
 *                  message:
 *                    type: string
 *                    description: optional application description
 *       500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/create', celebrate(healthValidation), HealthController.create);
/**
 * @swagger
 * /api/health/:
 *  post:
 *    tags:
 *      - Health
 *    summary: Get a health checkpoint
 *    description: Get all checkpoints in between startDate and endDate
 *    security:
 *      - Token: []
 *    parameters:
 *      - in: body
 *        name: startDate
 *        schema:
 *          type: date
 *          example: 2020-08-10T00:00Z
 *        required: false
 *        description: start date to search for a health checkpoint
 *      - in: body
 *        name: endDate
 *        schema:
 *          type: date
 *          example: 2020-09-10T00:00Z
 *        required: false
 *        description: end date to search for a health checkpoint
 *    responses:
 *       200:
 *          description: Success. Array of checkpoints between ${startDate} and ${endDate} returned to user (${id})
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Health'
 *       500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', celebrate(dateSpanValidation), HealthController.show);
/**
 * @swagger
 * /api/health/:id:
 *  delete:
 *    tags:
 *      - Health
 *    summary: Removes a checkpoint from Health series
 *    description: Use to delete a health checkpoint
 *    security:
 *      - Token: []
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123654
 *        required: true
 *        description: Id of the health checkpoint to delete
 *    responses:
 *       200:
 *          description: Checkpoint deleted
 *       404:
 *          description: Checkpoint not found with id param.
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
router.delete('/:id', celebrate(idValidation), HealthController.delete);

module.exports = router;
