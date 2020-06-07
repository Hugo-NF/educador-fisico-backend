const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        claims: [{
            type: mongoose.Schema.Types.ObjectId
        }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Role', roleSchema);
