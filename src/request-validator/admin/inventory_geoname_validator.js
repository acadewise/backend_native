const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');

function createInventoryGeonameSchema(req, res, next) {
    const schema = Joi.object({
        country_code: Joi.string().required().default('IN'),
        zip_code: Joi.string().required(),
        region: Joi.string().required(),
        city: Joi.string().required(),
        province: Joi.string().required(),
        latitude: Joi.string().allow(null).allow(''),
        longitude: Joi.string().allow(null).allow(''),
        is_active: Joi.boolean().required()
    });
    validateRequest(req, res, next, schema, "body");
}

function updateInventoryGeonameSchema(req, res, next) {
    const schema = Joi.object({
        country_code: Joi.string().default('IN'),
        zip_code: Joi.string(),
        region: Joi.string(),
        city: Joi.string(),
        province: Joi.string(),
        latitude: Joi.string(),
        longitude: Joi.string(),
        is_active: Joi.boolean()
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    createInventoryGeonameSchema,
    updateInventoryGeonameSchema
}