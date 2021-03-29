const mongoose = require('mongoose');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Routine:
 *        type: object
 *        required:
 *          - name
 *          - inteval
 *          - circuits
 *        properties:
 *          _id:
 *            type: string
 *            description: ObjectId
 *            example: 5ef7a24a3df17a5cf3180d13
 *          name:
 *            type: string
 *            description: Exercise name
 *            example: Supino inclinado
 *          inteval:
 *            type: number
 *            description: interval between circuits in seconds
 *            example: 40
 *          circuits:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                circuit:
 *                  type: object
 *                  $ref: '#/components/schemas/Circuit'
 */

const routineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  interval: {
    type: Number,
    required: true,
  },
  circuits: [{
    circuit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Circuit',
      required: true,
    },
  }],
},
{
  timestamps: true,
});

module.exports = mongoose.model('Routine', routineSchema);
