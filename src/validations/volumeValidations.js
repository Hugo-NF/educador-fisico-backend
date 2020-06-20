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
    [Segments.BODY]: Joi.object().keys({
        id: Joi.string().required(),
        repetition: Joi.number().required(),
        charge: Joi.number(),
        exercise: Joi.string().required(),
        observation: Joi.string()
    })
}

const deleteValidation = {
    [Segments.BODY]: Joi.object().keys({
        id: Joi.string().required()
    })
}

module.exports = {
    createValidation,
    editValidation,
    deleteValidation
}