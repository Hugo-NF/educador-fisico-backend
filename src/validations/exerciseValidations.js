const { Segments, Joi } = require('celebrate');

const indexValidation = {
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().min(1),
    max: Joi.number().min(1),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
  }),
};

const exerciseValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    video: Joi.string().required(),
  }),
};

module.exports = {
  indexValidation,
  exerciseValidation,
};
