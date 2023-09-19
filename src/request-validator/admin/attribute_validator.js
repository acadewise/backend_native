const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');

function createAttributeSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        image: Joi.string().allow(null).allow(""),
        is_default: Joi.boolean().required(),
        order: Joi.number().integer(),
        is_active: Joi.boolean().required(),
        attribute_categories: Joi.array().items(Joi.number().integer()).min(1)
    });
    validateRequest(req, res, next, schema, "body");
}

function createAttributeWithValueSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        image: Joi.string().allow(null).allow(""),
        is_default: Joi.boolean().required(),
        order: Joi.number().integer(),
        is_active: Joi.boolean().required(),
        attribute_categories: Joi.array().items(Joi.number().integer()).min(1),
        attribute_values: Joi.array().items({
            label: Joi.string().required(),
            value: Joi.string().required(),
            image: Joi.string().allow(null).allow(""),
            is_default: Joi.boolean().required(),
            order: Joi.number().integer(),
            is_active: Joi.boolean().required(),
        }).min(1),
    });
    validateRequest(req, res, next, schema, "body");
}

function updateAttributeSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string(),
        image: Joi.string(),
        is_default: Joi.boolean(),
        order: Joi.number().integer(),
        is_active: Joi.boolean(),
        attribute_categories: Joi.array().items({
            attribute_id: Joi.number().integer(),
            category_id: Joi.number().integer(),
            is_active: Joi.boolean()
        })
    });
    validateRequest(req, res, next, schema, "body");
}

function updateAttributeAndValueSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string(),
        image: Joi.string(),
        is_default: Joi.boolean(),
        order: Joi.number().integer(),
        is_active: Joi.boolean(),
        attribute_categories: Joi.array().items({
            id: Joi.number().integer(),
            attribute_id: Joi.number().integer(),
            category_id: Joi.number().integer(),
            is_active: Joi.boolean()
        }),
        attribute_values: Joi.array().items({
            label: Joi.string(),
            value: Joi.string(),
            image: Joi.string(),
            is_default: Joi.boolean(),
            order: Joi.number().integer(),
            is_active: Joi.boolean()
        })
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    createAttributeSchema,
    createAttributeWithValueSchema,
    updateAttributeSchema,
    updateAttributeAndValueSchema
}