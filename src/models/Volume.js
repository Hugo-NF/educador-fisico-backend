const mongoose = require('mongoose');

const volumeSchema = new mongoose.Schema({
        repetition: {
            type: Number,
            required: true,
            default: 1
        },
        charge: {
            type: Number,
            required: false
        },
        observation: {
            type: String,
            required: false
        },
        exercise: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercise',
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Volume', volumeSchema);
