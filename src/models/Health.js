const mongoose = require('mongoose');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Health:
 *        type: object
 *        properties:
 *          measures:
 *            type: object
 *            required:
 *              - height
 *              - weight
 *            description: Body measurements (in centimeters)
 *            properties:
 *              height:
 *                type: number
 *                example: 170
 *              weight:
 *                type: number
 *                example: 70
 *              chest:
 *                type: number
 *                example: 93
 *              waist:
 *                type: number
 *                example: 80
 *              abdomen:
 *                type: number
 *                example: 85
 *              hip:
 *                type: number
 *                example: 80
 *              forearm:
 *                type: number
 *                example: 30
 *              arm:
 *                type: number
 *                example: 35
 *              thigh:
 *                type: number
 *                example: 50
 *              calf:
 *                type: number
 *                example: 40
 *          bodyStats:
 *            type: object
 *            required:
 *              - vo2max
 *              - fatPercentage
 *            description: Body performance metrics
 *            properties:
 *              vo2max:
 *                type: number
 *                example: 40
 *              fatPercentage:
 *                type: number
 *                example: 15
 *          objective:
 *            type: string
 *            description: User's goal for it's training
 *            example: Emagrecimento
 *          ipaq:
 *            type: object
 *            description: IPAQ form answers
 *            required:
 *              - walkPerWeek1a
 *              - walkTimePerDay1b
 *              - moderateActivityPerWeek2a
 *              - moderateActivityTimePerDay2b
 *              - vigorousActivityPerWeek3a
 *              - vigorousActivityTimePerDay3b
 *              - seatedTimeWeekday4a
 *              - seatedTimeWeekend4b
 *            properties:
 *              walkPerWeek1a:
 *                type: number
 *                example: 2
 *              walkTimePerDay1b:
 *                type: number
 *                example: 1
 *              moderateActivityPerWeek2a:
 *                type: number
 *                example: 2
 *              moderateActivityTimePerDay2b:
 *                type: number
 *                example: 1
 *              vigorousActivityPerWeek3a:
 *                type: number
 *                example: 1
 *              vigorousActivityTimePerDay3b:
 *                type: number
 *                example: 2
 *              seatedTimeWeekday4a:
 *                type: number
 *                example: 40
 *              seatedTimeWeekend4b:
 *                type: number
 *                example: 10
 */

const healthSchema = new mongoose.Schema({
  measures: {
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    chest: { type: Number }, // torax
    waist: { type: Number }, // cintura
    abdomen: { type: Number },
    hip: { type: Number }, // quadril
    forearm: { type: Number },
    arm: { type: Number },
    thigh: { type: Number }, // coxa
    calf: { type: Number }, // panturrilha
  },
  bodyStats: {
    imc: { type: Number, required: true },
    iac: { type: Number, required: true },
    vo2max: { type: Number },
    fatPercentage: { type: Number },
  },
  ipaq: {
    walkPerWeek1a: { type: Number, required: true },
    walkTimePerDay1b: { type: Number, required: true },
    moderateActivityPerWeek2a: { type: Number, required: true },
    moderateActivityTimePerDay2b: { type: Number, required: true },
    vigorousActivityPerWeek3a: { type: Number, required: true },
    vigorousActivityTimePerDay3b: { type: Number, required: true },
    seatedTimeWeekday4a: { type: Number, required: true },
    seatedTimeWeekend4b: { type: Number, required: true },
  },
  objective: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Health', healthSchema);
