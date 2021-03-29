const { Segments, Joi } = require('celebrate');

const routineValidation = {
  [Segments.BODY]: Joi.object().keys({
    _id: Joi.string(),
    name: Joi.string().required(),
    interval: Joi.number().integer().required(),
    circuits: Joi.array().required().items(Joi.object().keys({
      circuit: Joi.string().required(),
    })),
  }),
};

module.exports = {
  routineValidation,
};
