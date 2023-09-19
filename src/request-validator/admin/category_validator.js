const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');

function createCategorySchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        position: Joi.number().required(),
        parent_id: Joi.number().allow(0),
        status: Joi.boolean().required(),
        category_color_code: Joi.string().allow(null).allow(""),
        category_configuration_rules: Joi.array().items(Joi.number().integer()).allow(null).allow(" ")
    });
    validateRequest(req, res, next, schema, "body");
}

function updateCategorySchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string(),
        position: Joi.number(),
        parent_id: Joi.number(),
        status: Joi.boolean(),
        category_color_code: Joi.string().allow(null).allow(""),
        category_configuration_rules: Joi.array().items({
            id: Joi.number().integer(),
            rule_id: Joi.number().integer(),
            category_id: Joi.number().integer(),
            is_active: Joi.boolean()
        })
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    createCategorySchema,
    updateCategorySchema
}