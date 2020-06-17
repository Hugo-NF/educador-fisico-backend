const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        video: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Exercise', exerciseSchema);

