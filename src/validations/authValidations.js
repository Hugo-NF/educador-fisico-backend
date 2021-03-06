const { Segments, Joi } = require('celebrate');

const registerValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    birthDate: Joi.date().required(),
    sex: Joi.string().required().valid('Male', 'Female', 'Other'),
    phone: Joi.object().keys({
      type: Joi.string().required().valid('Mobile', 'Home', 'Work', 'Other'),
      number: Joi.string().required().regex(/\+55 \(\d\d\) \d\d\d\d\d-\d\d\d\d/),
    }),
    city: Joi.string().required(),
    state: Joi.string().required().valid('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'),
  }),
};

const loginValidation = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

const emailRequestValidation = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    sandboxMode: Joi.boolean(),
  }),
};

const tokenForgeryCheckValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const resetPasswordValidation = {
  [Segments.BODY]: Joi.object().keys({
    password: Joi.string().required().min(8),
    sandboxMode: Joi.boolean(),
  }),
};

module.exports = {
  registerValidation,
  loginValidation,
  emailRequestValidation,
  tokenForgeryCheckValidation,
  resetPasswordValidation,
};
