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
    ipaq: Joi.object().keys({
      walkPerWeek1a: Joi.number().positive(),
      walkTimePerDay1b: Joi.number().positive(),
      moderateActivityPerWeek2a: Joi.number().positive(),
      moderateActivityTimePerDay2b: Joi.number().positive(),
      vigorousActivityPerWeek3a: Joi.number().positive(),
      vigorousActivityTimePerDay3b: Joi.number().positive(),
      seatedTimeWeekday4a: Joi.number().positive(),
      seatedTimeWeekend4b: Joi.number().positive(),
    }),
    objective: Joi.string().required(),
  }),
};

module.exports = {
  healthValidation,
};
