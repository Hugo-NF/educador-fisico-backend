const mongoose = require('mongoose');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Exercise:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          _id:
 *            type: string
 *            description: ObjectId
 *            example: 5ef7a24a3df17a5cf3180d13
 *          name:
 *            type: string
 *            description: Exercise name
 *            example: Supino inclinado
 *          video:
 *            type: string
 *            description: Reference to exercise video
 *            example: https://youtube.com/watch?v=aiuodhai9287y
 */

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: false,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Exercise', exerciseSchema);
