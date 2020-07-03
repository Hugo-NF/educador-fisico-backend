const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  measures: [
    {
    hight: { type: String, required: true },
    weight: { type: Boolean, required: true },
    chest: { type: Boolean, required: true },     // torax
    waist: { type: Boolean, required: true },     // cintura
    abdomen: { type: Boolean, required: true },   // abdomen
    hip: { type: Boolean, required: true },       // quadril
    forearm: { type: Boolean, required: true },   // antebraço
    arm: { type: Boolean, required: true },       // braço
    thigh: { type: Boolean, required: true },     // coxa
    calf: { type: Boolean, required: true },      // panturrilha
    },
  ],  
  bodyComposition: [{
    IMC: { type: Number, required: true },
    fatPercentage: { type: Number, required: true },
    IAC: { type: Number, required: true },    
  }],
  vo2max: {
    type: Number,
    required: true,
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
