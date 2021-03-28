const { Segments, Joi } = require('celebrate');

const exerciseValidation = {
  [Segments.BODY]: Joi.object().keys({
    _id: Joi.string(),
    name: Joi.string().required(),
    video: Joi.string().required(),
  }),
};

module.exports = {
  exerciseValidation,
};
