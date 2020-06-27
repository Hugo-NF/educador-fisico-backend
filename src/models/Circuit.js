const mongoose = require('mongoose');

const circuitSchema = new mongoose.Schema({
  name: { type: String },
  exercises: [{
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
    },
    repetitions: { type: Number },
    charge: { type: Number },
    duration: { type: Number },
    observation: { type: String },
  }],
},
{
  timestamps: true,
});

module.exports = mongoose.model('Circuit', circuitSchema);
