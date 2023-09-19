const Joi = require('joi');
const moment = require('moment');
const { validateRequest } = require('../../helper/request_validator');
const { DELIVERY_TYPE } = require('../../config/configuration_constant');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function addProductToCartSchema(req, res, next) {
    const date = new Date();
    const today = moment(date).format('YYYY-MM-DD');
    const nextDay = moment(date).add(1, 'days').format('YYYY-MM-DD');
    const schema = Joi.object({
        zip_code: Joi.number().integer().min(100000).max(999999).required().messages({
            'number.min': 'Invalid pin code.',
            'number.max': 'Invalid pin code.'
        }),
        cart_products: Joi.object({
            product_id: Joi.number().integer().required(),
            product_sku: Joi.string().required(),
            quantity: Joi.number().required(),
            product_delivery_type: Joi.string().valid(...DELIVERY_TYPE).required(),
            product_variation_type: Joi.string().allow(null).allow(''),
            product_variation_value: Joi.string().allow(null).allow(''),
            product_coupon_code: Joi.string().allow(null).allow(''),
            expected_delivery_date: Joi.date().allow(null).allow(''),
            expected_delivery_time: Joi.string().allow(null).allow(''),
            delivery_start_date: Joi.date().when('product_delivery_type', {
                is: Joi.string().valid(DELIVERY_TYPE[0],DELIVERY_TYPE[1], DELIVERY_TYPE[2]),
                then: Joi.date().min(today).required(),
                otherwise: Joi.valid(null, ""),
            }),
            delivery_end_date: Joi.date().when('product_delivery_type', {
                is: Joi.string().valid(DELIVERY_TYPE[0],DELIVERY_TYPE[1], DELIVERY_TYPE[2]),
                then: Joi.date().min(Joi.ref('delivery_start_date')).required(),
                otherwise: Joi.valid(null, ""),
            }),
            delivery_time_slot: Joi.string().allow(null).allow(''),
            auto_renew_subscription: Joi.boolean().default(false),
            milk_delivery_type: Joi.string().allow(null).allow(''),
            milk_delivery_slot: Joi.string().allow(null).allow(''),
            additional_rule_json: Joi.string().allow(null).allow(''),
            custom_delivery_dates: Joi.array().items(Joi.date().when('product_delivery_type', {
                is: Joi.string().valid(DELIVERY_TYPE[2]),
                then: Joi.date().min(nextDay).required(),
                otherwise: Joi.valid(null, ""),
            })).max(31),
        }).min(1).required()
    });
    validateRequest(req, res, next, schema, "body");
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function modifyProductToCartSchema(req, res, next) {
    const date = new Date();
    const today = moment(date).format('YYYY-MM-DD');
    const schema = Joi.object({
        product_id: Joi.number().integer().required(),
        quantity: Joi.number().min(1).required(),
        is_active: Joi.boolean().allow(null).allow(''),
        product_delivery_type: Joi.string().valid(...DELIVERY_TYPE).required(),
        product_variation_type: Joi.string().allow(null).allow(''),
        product_variation_value: Joi.string().allow(null).allow(''),
        product_coupon_code: Joi.string().allow(null).allow(''),
        delivery_start_date: Joi.date().when('product_delivery_type', {
            is: Joi.string().valid(DELIVERY_TYPE[0],DELIVERY_TYPE[1], DELIVERY_TYPE[2]),
            then: Joi.date().min(today).required(),
            otherwise: Joi.valid(null, ""),
        }),
        delivery_end_date: Joi.date().when('product_delivery_type', {
            is: Joi.string().valid(DELIVERY_TYPE[0],DELIVERY_TYPE[1], DELIVERY_TYPE[2]),
            then: Joi.date().min(Joi.ref('delivery_start_date')).required(),
            otherwise: Joi.valid(null, ""),
        }),
        delivery_time_slot: Joi.string().allow(null).allow(''),
        auto_renew_subscription: Joi.boolean().default(false),
        milk_delivery_type: Joi.string().allow(null).allow(''),
        milk_delivery_slot: Joi.string().allow(null).allow(''),
        additional_rule_json: Joi.string().allow(null).allow('')
    });
    validateRequest(req, res, next, schema, "body");
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function cartIdSchema(req, res, next) {
    const schema = Joi.object({
        cartId: Joi.string().guid().required()
    });
    validateRequest(req, res, next, schema, "param");
}

module.exports = {
    addProductToCartSchema,
    modifyProductToCartSchema,
    cartIdSchema
}