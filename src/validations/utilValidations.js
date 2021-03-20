const { Segments, Joi } = require('celebrate');

const idValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const indexValidation = {
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().min(1),
    max: Joi.number().min(1),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().allow(''),
  }),
};

const dateSpanValidation = {
  [Segments.BODY]: Joi.object().keys({
    startDate: Joi.date(),
    endDate: Joi.date(),
  }),
};

module.exports = {
  idValidation,
  indexValidation,
  dateSpanValidation,
};
