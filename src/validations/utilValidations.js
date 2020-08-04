const { Segments, Joi } = require('celebrate');

const idValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
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
  dateSpanValidation,
};
