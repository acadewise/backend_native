const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');

function createAdminSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email().required(),
        phone_number: Joi.string().required()
    });
    validateRequest(req, res, next, schema, "body");
}

function updateAdminSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string()
    });
    validateRequest(req, res, next, schema, "body");
}

function activeInactiveAdminSchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().required(),
        status: Joi.string().valid('active', 'inactive').required()
    });
    validateRequest(req, res, next, schema, "param");
}



module.exports = {
    createAdminSchema,
    updateAdminSchema,
    activeInactiveAdminSchema
}