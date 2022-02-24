import joi from '@hapi/joi';

export const registrationValidate = (data) => {
    const schema = joi.object({
        firstname: joi.string().min(3).required(),
        lastname: joi.string().min(3).required(),
        name: joi.string().min(3).required(),
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required()
    })
    return schema.validate(data);
}

export const loginValidate = (data) => {
    const schema = joi.object({
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required()
    })
    return schema.validate(data);
}
