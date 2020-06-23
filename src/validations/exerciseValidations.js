const { Segments, Joi } = require('celebrate');

const createValidation = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        video: Joi.string().required(),
    })
}
 
const editValidation = {
    [Segments.BODY]: Joi.object().keys({
        id: Joi.string().required(),
        name: Joi.string().required(),
        video: Joi.string().required(),
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