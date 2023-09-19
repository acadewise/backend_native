const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        phone_number: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({ 'string.pattern.base': 'Invalid phone number.' }),
        language_id: Joi.number().required()
    });
    validateRequest(req, res, next, schema, "body");
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function updateAdminSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string()
    });
    validateRequest(req, res, next, schema, "body");
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function activeInactiveAdminSchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().required(),
        status: Joi.string().valid('active', 'inactive').required()
    });
    validateRequest(req, res, next, schema, "param");
}

module.exports = {
    authenticateSchema,
    updateAdminSchema,
    activeInactiveAdminSchema
}