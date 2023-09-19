const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');

function createUnitSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        slug: Joi.string().required(),
        is_active: Joi.boolean().required()
    });
    validateRequest(req, res, next, schema, "body");
}

function updateUnitSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string(),
        slug: Joi.string(),
        is_active: Joi.boolean(),
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    createUnitSchema,
    updateUnitSchema
}