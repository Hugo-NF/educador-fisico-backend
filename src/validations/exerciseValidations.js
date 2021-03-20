const { Segments, Joi } = require('celebrate');

const exerciseValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    video: Joi.string().required(),
  }),
};

module.exports = {
  exerciseValidation,
};
