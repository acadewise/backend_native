const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');

function addUserAddressSchema(req, res, next) {
    const schema = Joi.object({
        user_id: Joi.string().guid().required(),
        address_type: Joi.string().valid('home', 'office', 'other').required(),
        is_default: Joi.boolean().default(false).allow(null).allow(''),
        phone_number: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({ 'string.pattern.base': 'Invalid phone number.' }),
        street: Joi.string().required(),
        landmark: Joi.string().allow(null).allow(''),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipcode: Joi.string().required(),
        country: Joi.string().required()
    });
    validateRequest(req, res, next, schema, "body");
}

function updateUserAddressSchema(req, res, next) {
    const schema = Joi.object({
        address_type: Joi.string().valid('home', 'office', 'other'),
        is_default: Joi.boolean(),
        phone_number: Joi.string().length(10).pattern(/^[0-9]+$/).messages({ 'string.pattern.base': 'Invalid phone number.' }),
        street: Joi.string(),
        landmark: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zipcode: Joi.string(),
        country: Joi.string()
    });
    validateRequest(req, res, next, schema, "body");
}

function createUserSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().allow(null).allow(''),
        phone_number: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({ 'string.pattern.base': 'Invalid phone number.' }),
        gender: Joi.string().allow(null).allow(''),
        language_id: Joi.number().integer().required(),
        addresses: Joi.array().items({
            address_type: Joi.string().valid('home', 'office', 'other').required(),
            is_default: Joi.boolean().default(false).allow(null).allow(''),
            phone_number: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({ 'string.pattern.base': 'Invalid phone number.' }),
            street: Joi.string().required(),
            landmark: Joi.string().allow(null).allow(''),
            city: Joi.string().required(),
            state: Joi.string().required(),
            zipcode: Joi.string().required(),
            country: Joi.string().required()
        }).min(1)
    });
    validateRequest(req, res, next, schema, "body");
}

function addUserAddressApiSchema(req, res, next) {
    const schema = Joi.object({
        address_type: Joi.string().valid('home', 'office', 'other').required(),
        is_default: Joi.boolean().default(false).allow(null).allow(''),
        phone_number: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({ 'string.pattern.base': 'Invalid phone number.' }),
        street: Joi.string().required(),
        landmark: Joi.string().allow(null).allow(''),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipcode: Joi.string().required(),
        country: Joi.string().required()
    });
    validateRequest(req, res, next, schema, "body");
}

function addUserFirstAddressSchema(req, res, next) {
    const schema = Joi.object({
        zipcode: Joi.string().required()
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    addUserAddressSchema,
    updateUserAddressSchema,
    createUserSchema,
    addUserAddressApiSchema,
    addUserFirstAddressSchema
}