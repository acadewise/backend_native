const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');

function loginSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    validateRequest(req, res, next, schema, "body");
}

function sendForgotPasswordSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });
    validateRequest(req, res, next, schema, "body");
}

function resetPasswordSchema(req, res, next) {
    const schema = Joi.object({
        password: Joi.string().required()
    });
    validateRequest(req, res, next, schema, "param");
}

module.exports = {
    loginSchema,
    sendForgotPasswordSchema,
    resetPasswordSchema
}