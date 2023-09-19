const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');

function createTagSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(null).allow(""),
        status: Joi.boolean().required()
    });
    validateRequest(req, res, next, schema, "body");
}

function updateTagSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        status: Joi.boolean()
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    createTagSchema,
    updateTagSchema
}