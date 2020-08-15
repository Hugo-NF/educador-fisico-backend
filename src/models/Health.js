const mongoose = require('mongoose');

// Health Schema
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
