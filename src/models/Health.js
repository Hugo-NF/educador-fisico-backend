const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema({
  date: { type: String },
  measures: [{
    hight: { type: Number  },
    weight: { type: Number },
    body: { type: Number },
    body: { type: Number },
    body: { type: Number },
  }],
  indexes: [{
    IMC: { type: Number },
    fatPercentage: { type: Number },
    IAC: { type: Number },    
  }],

},
{
  timestamps: true,
});

module.exports = mongoose.model('Health', healthSchema);
