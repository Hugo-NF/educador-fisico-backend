const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Defining User Schema
const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    min: 36,
  },
  name: {
    type: String,
    required: true,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 255,
  },
  emailConfirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
  emailConfirmationToken: {
    type: String,
  },
  emailConfirmationTokenExpiration: {
    type: Date,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 1024,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  phones: [
    {
      type: { type: String, required: true },
      number: { type: String, required: true },
      confirmed: { type: Boolean, required: true, default: false },
    },
  ],
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
    max: 2,
  },
  lockoutEnabled: {
    type: Boolean,
    required: true,
    default: true,
  },
  lockoutReason: {
    type: String,
    required: false,
  },
  lockoutUntil: {
    type: Date,
    default: Date.now,
  },
  accessFailedCount: {
    type: Number,
    required: true,
    default: 0,
  },
  accessFailedLimit: {
    type: Number,
    required: true,
    default: 10,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordTokenExpiration: {
    type: Date,
  },
  twoFactorAuthToken: {
    type: String,
  },
  twoFactorAuthTokenExpiration: {
    type: Date,
  },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  claims: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Claim' }],

  healthCheckpoints: [{
    date: {
      type: Date,
      required: true,
    },
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
    objective: {
      type: String,
      required: true,
    },
  }],
},
{
  timestamps: true,
});

// Mongoose callback - Password Hashing
userSchema.pre('save', async function (next) {
  const user = this;
  // Password has not changed
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);

  return next();
});

userSchema.pre('updateOne', async function (next) {
  const user = this;

  // Password has not changed
  if (!Object.prototype.hasOwnProperty.call(user._update, 'password')) return next();

  const salt = await bcrypt.genSalt();
  user._update.password = await bcrypt.hash(user._update.password, salt);

  return next();
});
module.exports = mongoose.model('User', userSchema);
