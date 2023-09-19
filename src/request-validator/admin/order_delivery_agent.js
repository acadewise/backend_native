const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');


function createOrderDeliveryAgentSchema(req, res, next) {
    const schema = Joi.object({
        order_id: Joi.number().required(),
        delivery_agent_id: Joi.string().required(),
        user_id: Joi.string().required(),
        delivery_point_address_id: Joi.number().required(),
        delivery_date: Joi.string().allow(""),
        delivery_time: Joi.string().allow(""),
        delivery_status: Joi.string().allow(""),
        remarks: Joi.string().allow(""),
    });
    validateRequest(req, res, next, schema, "body");
}

function updateOrderDeliveryAgentSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        route_description: Joi.string().required(),
        zip_code: Joi.string().required(),
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    createOrderDeliveryAgentSchema,
    updateOrderDeliveryAgentSchema
}