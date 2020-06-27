const { Segments, Joi } = require('celebrate');

const createValidation = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        video: Joi.string().required(),
    })
}
 
const editValidation = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        video: Joi.string().required(),
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