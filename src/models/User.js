const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Defining User Schema
const userSchema = new mongoose.Schema({
        _id: {
            type: String,
            required: true,
            min: 36
        },
        name: {
            type: String,
            required: true,
            max: 255
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 255
        },
        emailConfirmed: {
            type: Boolean,
            required: true,
            default: false
        },
        password: {
            type: String,
            required: true,
            min: 8,
            max: 1024
        },
        birthDate: {
            type: Date,
            required: true
        },
        sex: {
            type: String,
            required: true
        },
        phones: [
            {
                type: {type: String, required: true},
                number: {type: String, required: true},
                confirmed: {type: Boolean, required: true, default: false}
            }
        ],
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true,
            max: 2
        },
        lockoutEnabled: {
            type: Boolean,
            required: true,
            default: true
        },
        lockoutUntil: {
            type: Date,
            default: Date.now
        },
        accessFailedCount: {
            type: Number,
            required: true,
            default: 0
        },
        accessFailedLimit: {
            type: Number,
            required: true,
            default: 10
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordTokenExpiration: {
            type: Date
        },
        twoFactorAuthToken: {
            type: String
        },
        twoFactorAuthTokenExpiration: {
            type: Date
        },
        roles: [{type: mongoose.Schema.Types.ObjectId}],
        claims: [{type: mongoose.Schema.Types.ObjectId}],
        trainings: [{type: mongoose.Schema.Types.ObjectId}],
        activeTraining: {
            type: Number,
            required: false
        }
    },
    {
        timestamps: true
    }
);

// Mongoose callback - Password Hashing
userSchema.pre('save', async function(next) {
    let user = this;

    // Password has not changed
    if (!user.isModified('password')) return next();
  
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
      
    next();
});

module.exports = mongoose.model('User', userSchema);
