const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function createUserSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        dob: Joi.string(),
        gender: Joi.string(),
        language_id: Joi.number().integer()
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    createUserSchema
}