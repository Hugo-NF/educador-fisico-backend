const { Segments, Joi } = require('celebrate');

const createValidation = {
    [Segments.BODY]: Joi.object().keys({
        repetition: Joi.number().required(),
        charge: Joi.number(),
        exercise: Joi.string().required(),
        observation: Joi.string()
    })
}
 
const editValidation = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        repetition: Joi.number().required(),
        charge: Joi.number(),
        exercise: Joi.string().required(),
        observation: Joi.string()
    })
}

const deleteValidation = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    })
}

module.exports = {
    createValidation,
    editValidation,
    deleteValidation
}