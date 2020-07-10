const { Segments, Joi } = require('celebrate');

const healthValidation = {
  [Segments.BODY]: Joi.object().keys({
    measures: Joi.object().keys({
      height: Joi.number().required().positive(),
      weight: Joi.number().required().positive(),
      chest: Joi.number().positive(),
      waist: Joi.number().positive(),
      abdomen: Joi.number().positive(),
      hip: Joi.number().positive(),
      forearm: Joi.number().positive(),
      arm: Joi.number().positive(),
      thigh: Joi.number().positive(),
      calf: Joi.number().positive(),
    }),
    bodyStats: Joi.object().keys({
      vo2max: Joi.number().positive(),
      fatPercentage: Joi.number().positive(),
    }),
    objective: Joi.string().required(),
  }),
};

module.exports = {
  healthValidation,
};
