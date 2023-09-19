const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');


function createCouponMasterSchema(req, res, next) {
    const schema = Joi.object({
        coupon_code: Joi.string().required(),
        coupon_title: Joi.string().required(),
        coupon_description: Joi.string(),
        coupon_type: Joi.string(),
        coupon_quantity: Joi.number().integer().required(),
        used_coupon_quantity: Joi.number().integer().required(),
        coupon_amount: Joi.number().required(),
        from_date: Joi.string().required(),
        to_date: Joi.string().required(),
        coupon_status: Joi.boolean(),
    });
    validateRequest(req, res, next, schema, "body");
}

function updateCouponMasterSchema(req, res, next) {
    const schema = Joi.object({
        coupon_code: Joi.string().required(),
        coupon_title: Joi.string().required(),
        coupon_description: Joi.string(),
        coupon_type: Joi.string(),
        coupon_quantity: Joi.number().integer().required(),
        used_coupon_quantity: Joi.number().integer().required(),
        coupon_amount: Joi.number().required(),
        from_date: Joi.string().required(),
        to_date: Joi.string().required(),
        coupon_status: Joi.boolean(),
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    createCouponMasterSchema,
    updateCouponMasterSchema
}