const { Segments, Joi } = require('celebrate');

const indexValidation = {
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().min(1),
    max: Joi.number().min(1),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().allow(''),
  }),
};

const circuitValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
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
  indexValidation,
  circuitValidation,
};
