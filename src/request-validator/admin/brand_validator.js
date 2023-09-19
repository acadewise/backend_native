const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');

function createBrandSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        website: Joi.string().allow(null).allow(""),
        logo: Joi.string().allow(null).allow(""),
        position: Joi.number().allow(null).allow(""),
        is_featured: Joi.boolean(),
        is_active: Joi.boolean().required()
    });
    validateRequest(req, res, next, schema, "body");
}

function updateBrandSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        website: Joi.string().allow(null).allow(""),
        logo: Joi.string().allow(null).allow(""),
        position: Joi.number().allow(null).allow(""),
        is_featured: Joi.boolean(),
        is_active: Joi.boolean()
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    createBrandSchema,
    updateBrandSchema
}