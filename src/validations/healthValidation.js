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

const healthValidation = {
  [Segments.BODY]: Joi.object().keys({
    date: Joi.string(),
    measures: Joi.array().required().items(Joi.object().keys({
      hight: Joi.number().min(0),
      weight: Joi.number().min(0),
      chest: Joi.number().min(0), 
      waist: Joi.number().min(0),         
      abdomen: Joi.number().min(0),
      hip: Joi.number().min(1),
      forearm: Joi.number().min(1),    
      arm: Joi.number().min(1),    
      thigh: Joi.number().min(1),    
      calf: Joi.number().min(1),    
    })),
    bodyComposition: Joi.array().required().items(Joi.object().keys({
      imc: Joi.number().required(),
      fatPercentage: Joi.number().min(0),
      iac: Joi.number().min(1), 
    })),
    vo2max: Joi.number(),
    objective: Joi.string(),
  }),
};

module.exports = {
  indexValidation,
  healthValidation,
};
