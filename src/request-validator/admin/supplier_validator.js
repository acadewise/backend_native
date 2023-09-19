const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');


function createSupplierSchema(req, res, next) {
    const schema = Joi.object({
        owner_name: Joi.string().required(),
        bussiness_name: Joi.string().required(),
        phone_number: Joi.string().required(),
        supplier_email: Joi.string().required(),
        gst_number: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipcode: Joi.string().required(),
        landmark: Joi.string().allow(null).allow(""),
        is_active: Joi.boolean()
    });
    validateRequest(req, res, next, schema, "body");
}

function updateSupplierSchema(req, res, next) {
    const schema = Joi.object({
        owner_name: Joi.string().required(),
        bussiness_name: Joi.string().required(),
        phone_number: Joi.string().required(),
        supplier_email: Joi.string().required(),
        gst_number: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipcode: Joi.string().required(),
        landmark: Joi.string().allow(null).allow(""),
        is_active: Joi.boolean()
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    createSupplierSchema,
    updateSupplierSchema
}