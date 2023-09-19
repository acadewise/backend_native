const Joi = require('joi');
const moment = require('moment');
const { validateRequest } = require('../../helper/request_validator');
const { ADDRESS_TYPE, ORDER_PAYMENT_METHOD, DELIVERY_TYPE, ORDER_TYPE, ORDER_STATUS } = require('../../config/configuration_constant');
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function orderSchema(req, res, next) {
        const date = new Date();
        const today = moment(date).format('YYYY-MM-DD');
        const schema = Joi.object({
                customer_id: Joi.string().required(),
                customer_email: Joi.string().email().allow(null).allow(''),
                customer_phone: Joi.string().required(),
                delivery_pincode: Joi.string().required(),
                currency: Joi.string().required(),
                remote_ip: Joi.string().allow(null).allow(''),
                order_type: Joi.string().valid(...ORDER_TYPE).required(),
                payment_method: Joi.string().valid(...ORDER_PAYMENT_METHOD).required(),
                payment_amount: Joi.number().required(),
                advance_payment: Joi.number().allow(null).allow(0),
                shipping_amount: Joi.number().allow(null).allow(0),
                shipping_discount_amount: Joi.number().max(Joi.ref('shipping_amount')).allow(null).allow(0),
                coupon_code: Joi.string().allow(null).allow(''),
                billing_address_id: Joi.number().integer().required(),
                shipping_address_id: Joi.number().integer().required(),
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
                item_details: Joi.array().items({
                        item_id: Joi.number().integer().required(),
                        item_sku: Joi.string().required(),
                        item_image: Joi.string().allow(null).allow(''),
                        quantity: Joi.number().required(),
                        item_price: Joi.number().required(),
                        shipping_charge: Joi.number().required(),
                        discount: Joi.number().allow(null).allow(''),
                        variation_type: Joi.string().allow(null).allow(''),
                        variation_value: Joi.string().allow(null).allow(''),
                        product_delivery_type: Joi.string().valid(...DELIVERY_TYPE).required(),
                        expected_delivery_date: Joi.date().allow(null).allow(''),
                        expected_delivery_time: Joi.string().allow(null).allow(''),
                        delivery_start_date: Joi.date().when('product_delivery_type', {
                                is: Joi.string().valid(DELIVERY_TYPE[0], DELIVERY_TYPE[2]),
                                then: Joi.date().min(today).required(),
                                otherwise: Joi.valid(null, ""),
                        }),
                        delivery_end_date: Joi.date().when('product_delivery_type', {
                                is: Joi.string().valid(DELIVERY_TYPE[0], DELIVERY_TYPE[2]),
                                then: Joi.date().min(Joi.ref('delivery_start_date')).required(),
                                otherwise: Joi.valid(null, ""),
                        }),
                        delivery_time: Joi.string().allow(null).allow(''),
                        auto_renew_subscription: Joi.boolean().allow(null).allow(''),
                        milk_delivery_type: Joi.array().items(Joi.string().valid('morning', 'afternoon', 'evening')).allow(null).allow(''),
                        milk_delivery_slot: Joi.array().allow(null).allow(''),
                        additional_rule_json: Joi.array().allow(null).allow('')
                }).min(1)
        });
        validateRequest(req, res, next, schema, "body");
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function orderStatusSchema(req, res, next) {
        const schema = Joi.object({
                order_id: Joi.string().required(),
                status: Joi.string().valid(...ORDER_STATUS).required()
        });
        validateRequest(req, res, next, schema, "param");
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function orderAddressSchema(req, res, next) {
        const schema = Joi.object({
                order_address: Joi.object({
                        delivery_pincode: Joi.string().required(),
                        billing_address_id: Joi.number().integer().required(),
                        shipping_address_id: Joi.number().integer().required(),
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
                })
        });
        validateRequest(req, res, next, schema, "body");
}

module.exports = {
        orderSchema,
        orderStatusSchema,
        orderAddressSchema
}