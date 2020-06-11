const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

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
            default: Date.UTC
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
userSchema.pre('save', function(next) {
    let user = this;
    const SALT_FACTOR = 10;
    
    if(user.isNew()) user._id = uuidv4();

    // Password has not changed
    if (!user.isModified('password')) return next();
  

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
      if (err) return next(err);
  
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });

});

module.exports = mongoose.model('User', userSchema);
