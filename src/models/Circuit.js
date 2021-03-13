const mongoose = require('mongoose');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Circuit:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *            description: ObjectId
 *            example: 5ef7a24a3df17a5cf3180d13
 *          name:
 *            type: string
 *            description: Circuit name
 *            example: Supino bi-set
 *          exercises:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                exercise:
 *                  type: object
 *                  $ref: '#/components/schemas/Circuit'
 *                repetitions:
 *                  type: number
 *                  description: Circuit repetitions
 *                  example: 10
 *                weight:
 *                  type: number
 *                  description: Circuit weight
 *                  example: 45
 *                duration:
 *                  type: number
 *                  description: Circuit time duration
 *                  example: 15
 *                observation:
 *                  type: string
 *                  description: Any observation from trainer
 *                  example: Usar halteres
 */

const circuitSchema = new mongoose.Schema({
  name: { type: String },
  exercises: [{
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
    },
    repetitions: { type: Number },
    weight: { type: Number },
    duration: { type: Number },
    observation: { type: String },
  }],
},
{
  timestamps: true,
});

module.exports = mongoose.model('Circuit', circuitSchema);
