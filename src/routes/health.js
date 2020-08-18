/**
 * This file contains all the routes related to the user entity
 *
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
 *      - health
 *    summary: Create a health checkpoint
 *    description: Used to create a health checkpoint
 *    parameters:
 *      - in: body
 *        name: measures
 *        schema:
 *          type: json
 *          example:
 *            height: 170
 *            weight: 70
 *            chest: 93
 *            waist: 80
 *            abdomen: 85
 *            hip: 80
 *            forearm: 30
 *            arm: 35
 *            thigh: 50
 *            calf: 40
 *        required: true
 *        description: measures of the user (in centimeters)
 *      - in: body
 *        name: bodyStats
 *        schema:
 *          type: json
 *          example:
 *            imc: 26.7
 *            iac: 18.09
 *            vo2max: 40
 *            fatPercentage: 15
 *        required: true
 *        description: body stats
 *      - in: body
 *        name: ipaq
 *        schema:
 *          type: json
 *          example:
 *            walkPerWeek1a: 2
 *            walkTimePerDay1b: 1
 *            moderateActivityPerWeek2a: 2
 *            moderateActivityTimePerDay2b: 1
 *            vigorousActivityPerWeek3a: 1
 *            vigorousActivityTimePerDay3b: 2
 *            seatedTimeWeekday4a: 40
 *            seatedTimeWeekend4b: 10
 *        required: true
 *        description: ipaq
 *      - in: body
 *        name: objective
 *        schema:
 *          type: string
 *          example: Be a monster
 *        required: true
 *        description: Objective of the user
 *    responses:
 *      '200':
 *          description: a successful response
 *      '500':
 *          description: Error while saving new checkpoint to user
 */
router.post('/create', celebrate(healthValidation), HealthController.create);
/**
 * @swagger
 * /api/health/:
 *  post:
 *    tags:
 *      - health
 *    summary: Get a health checkpoint
 *    description: Used to get a health checkpoint
 *    parameters:
 *      - in: body
 *        name: startDate
 *        schema:
 *          type: date
 *          example: 2020-08-10T00:28Z
 *        required: false
 *        description: start date to search for a health checkpoint
 *      - in: body
 *        name: endDate
 *        schema:
 *          type: date
 *          example: 2020-08-10T00:28Z
 *        required: false
 *        description: end date to search for a health checkpoint
 *    responses:
 *      '200':
 *          description: Checkpoints between ${startDate} and ${endDate} returned to user (${id})
 *      '500':
 *          description: Could not retrieve health checkpoints for user
 */
router.post('/', celebrate(dateSpanValidation), HealthController.show);
/**
 * @swagger
 * /api/health/:id:
 *  delete:
 *    tags:
 *      - health
 *    summary: delete a health checkpoint
 *    description: Used to delete a health checkpoint
 *    parameters:
 *      - in: params
 *        name: id
 *        schema:
 *          type: string
 *          example: 123654
 *        required: true
 *        description: Id of the health checkpoint to delete
 *    responses:
 *      '200':
 *          description: A successful response
 *      '404':
 *          description: Health checkpoint could not be found
 *      '500':
 *          description: Could not delete health checkpoint
 */
router.delete('/:id', celebrate(idValidation), HealthController.delete);

module.exports = router;
