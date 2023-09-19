const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');
const { ADDRESS_TYPE, ORDER_PAYMENT_METHOD, ORDER_FETCH_TYPE, ORDER_FETCH_SUBTYPE, PAYMENT_GATEWAYS } = require('../../config/configuration_constant');


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function getCheckoutSchema(req, res, next) {
    const schema = Joi.object({
        coupon_code: Joi.string().allow(null).allow(''),
        shipping_address_id: Joi.number().integer().required(),
        billing_address_id: Joi.number().integer().required(),
        shipping_pin_code: Joi.string().required(),
        include_reward_coin_pay: Joi.boolean().default(false).allow(null).allow(''),
        pay_reward_coin_quantity: Joi.number().default(0).allow(null).allow(''),
        currency: Joi.string().allow(null).allow('')
    });
    validateRequest(req, res, next, schema, "body");
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function createOrderFromCartSchema(req, res, next) {
    const schema = Joi.object({
        shipping_pin_code: Joi.string().required(),
        billing_address_id: Joi.number().integer().required(),
        shipping_address_id: Joi.number().integer().required(),
        remote_ip: Joi.string().allow(null).allow(''),
        payment_method: Joi.string().valid(...ORDER_PAYMENT_METHOD).required(),
        address_details: Joi.object({
            billing_address_type: Joi.string().valid(...ADDRESS_TYPE).required(),
            billing_name: Joi.string().required(),
            billing_email: Joi.string().email().allow(null).allow(''),
            billing_phone_number: Joi.string().required(),
            billing_street_address: Joi.string().required(),
            billing_landmark: Joi.string().allow(null).allow(''),
            billing_city: Joi.string().required(),
            billing_state: Joi.string().required(),
            billing_country: Joi.string().required(),
            billing_zip_code: Joi.string().required(),
            shipping_address_type: Joi.string().valid(...ADDRESS_TYPE).required(),
            shipping_name: Joi.string().required(),
            shipping_email: Joi.string().email().allow(null).allow(''),
            shipping_phone_number: Joi.string().required(),
            shipping_street_address: Joi.string().required(),
            shipping_landmark: Joi.string().allow(null).allow(''),
            shipping_city: Joi.string().required(),
            shipping_state: Joi.string().required(),
            shipping_country: Joi.string().required(),
            shipping_zip_code: Joi.string().required(),
        }).required(),
    });
    validateRequest(req, res, next, schema, "body");
}

function orderTypeSchema(req, res, next) {
    const schema = Joi.object({
        type: Joi.string().valid(...ORDER_FETCH_TYPE).required(),
        subType: Joi.string().valid(...ORDER_FETCH_SUBTYPE).required()
    });
    validateRequest(req, res, next, schema, "param");
}

function cancelDeliverySchema(req, res, next) {
    const schema = Joi.object({
        order_id: Joi.string().allow(null).allow(''),
        product_id: Joi.number().integer().required(),
        delivery_date: Joi.date().required()
    });
    validateRequest(req, res, next, schema, "body");
}

function paymentStatusSchema(req, res, next) {
    const schema = Joi.object({
        payment_method: Joi.string().valid(...PAYMENT_GATEWAYS).required(),
        payment_status: Joi.string().valid('SUCCESS', 'FAILED', 'PENDING').required(),
        payment_payload: Joi.string().required()
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    getCheckoutSchema,
    createOrderFromCartSchema,
    orderTypeSchema,
    cancelDeliverySchema,
    paymentStatusSchema
}