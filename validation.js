const joi = require('@hapi/joi');

const registrationValidate = (data) => {
    const schema = joi.object({
        name: joi.string().min(6).required(),
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required()
    })
    return schema.validate(data);
}

const loginValidate = (data) => {
    const schema = joi.object({
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required()
    })
    return schema.validate(data);
}

module.exports.registrationValidate = registrationValidate;
module.exports.loginValidate = loginValidate;
