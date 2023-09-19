const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');

function createAttributeValueSchema(req, res, next) {
    const schema = Joi.object({
        attribute_id: Joi.number().integer().required(),
        label: Joi.string().required(),
        value: Joi.string().required(),
        image: Joi.string().allow(null).allow(""),
        is_default: Joi.boolean().required(),
        order: Joi.number().integer(),
        is_active: Joi.boolean().required(),
    });
    validateRequest(req, res, next, schema, "body");
}

function updateAttributeValueSchema(req, res, next) {
    const schema = Joi.object({
        attribute_id: Joi.number().integer(),
        label: Joi.string(),
        value: Joi.string(),
        image: Joi.string(),
        is_default: Joi.boolean(),
        order: Joi.number().integer(),
        is_active: Joi.boolean(),
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    createAttributeValueSchema,
    updateAttributeValueSchema
}