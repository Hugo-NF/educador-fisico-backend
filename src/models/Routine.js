const mongoose = require('mongoose');

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
