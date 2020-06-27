const { Segments, Joi } = require('celebrate');

const indexValidation = {
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().min(1),
    max: Joi.number().min(1),
  }),
};

const createValidation = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    video: Joi.string().required(),
  }),
};

const editValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    video: Joi.string().required(),
  }),
};

const deleteValidation = {
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  indexValidation,
  createValidation,
  editValidation,
  deleteValidation,
};
