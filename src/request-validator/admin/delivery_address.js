const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');


function createDeliveryAddressSchema(req, res, next) {
    const schema = Joi.object({
        street_address: Joi.string().required(),
        land_mark: Joi.string().allow(null).allow(""),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().required(),
        delivery_type: Joi.string(),
        
    });
    validateRequest(req, res, next, schema, "body");
}

function updateDeliveryAddressSchema(req, res, next) {
    const schema = Joi.object({
        street_address: Joi.string().required(),
        land_mark: Joi.string().allow(null).allow(""),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().required(),
        delivery_type: Joi.string(),
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    createDeliveryAddressSchema,
    updateDeliveryAddressSchema
}