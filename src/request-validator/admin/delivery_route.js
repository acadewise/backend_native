const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');


function createDeliveryRouteSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        route_description: Joi.string().required(),
        zip_code: Joi.string().required(),
    });
    validateRequest(req, res, next, schema, "body");
}

function updateDeliveryRouteSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        route_description: Joi.string().required(),
        zip_code: Joi.string().required(),
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    createDeliveryRouteSchema,
    updateDeliveryRouteSchema
}