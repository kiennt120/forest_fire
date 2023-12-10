const Joi = require('joi');

module.exports.registerValidator = (data) => {
    const rule = Joi.object({
        email: Joi.string().min(1).max(225).required().email(),
        password: Joi.string().min(6).max(225).required(),
        // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')).required(),
    })

    return rule.validate(data);
}
