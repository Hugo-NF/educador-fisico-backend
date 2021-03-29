const { Segments, Joi } = require('celebrate');

const circuitValidation = {
  [Segments.BODY]: Joi.object().keys({
    _id: Joi.string(),
    name: Joi.string().required(),
    exercises: Joi.array().required().items(Joi.object().keys({
      exercise: Joi.string().required(),
      repetitions: Joi.number().min(1),
      weight: Joi.number().min(0),
      duration: Joi.number().min(0),
      observation: Joi.string(),
    })),
  }),
};

module.exports = {
  circuitValidation,
};
