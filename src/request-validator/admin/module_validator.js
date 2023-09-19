const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');

function createModuleSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        is_active: Joi.boolean().required(),
    });
    validateRequest(req, res, next, schema, "body");
}

function updateModuleSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string(),
        is_active: Joi.boolean(),
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    createModuleSchema,
    updateModuleSchema
}