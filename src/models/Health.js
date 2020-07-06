const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  measures: [
    {
    hight: { type: Number, required: true },
    weight:{ type: Number, required: true },
    chest: { type: Number, required: true },     // torax
    waist: { type: Number, required: true },     // cintura
    abdomen: { type: Number, required: true },   // abdomen
    hip: { type: Number, required: true },       // quadril
    forearm: { type: Number, required: true },   // antebraço
    arm: { type: Number, required: true },       // braço
    thigh: { type: Number, required: true },     // coxa
    calf:  { type: Number, required: true },     // panturrilha
    },
  ],  
  bodyComposition: [{
    imc: { type: Number, required: true },
    fatPercentage: { type: Number, required: true },
    iac: { type: Number, required: true },    
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
