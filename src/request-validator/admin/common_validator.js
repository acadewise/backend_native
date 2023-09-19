const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');
const { MEDIA_TYPE, FOLDER_TYPE } = require('../../config/configuration_constant');
const { Unique_Fields } = require('../../constants/admin');

function idSchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().integer().required(),
    });
    validateRequest(req, res, next, schema, "param");
}

function idQuerySchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().integer().required(),
    });
    validateRequest(req, res, next, schema, "query");
}

function uuIdSchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.string().guid().required(),
    });
    validateRequest(req, res, next, schema, "param");
}

function uuIdQuerySchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.string().guid().required()
    });
    validateRequest(req, res, next, schema, "query");
}

function orderIdQuerySchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.string().required()
    });
    validateRequest(req, res, next, schema, "query");
}

function orderIdParamSchema(req, res, next) {
    const schema = Joi.object({
        order_id: Joi.string().required()
    });
    validateRequest(req, res, next, schema, "param");
}

function imageSchema(req, res, next) {
    const schema = Joi.object({
        media_type: Joi.string().required().valid(...MEDIA_TYPE),
        type: Joi.string().required().valid(...FOLDER_TYPE),
        quality: Joi.number().integer().min(10).max(100).allow(null).allow('')
    });
    validateRequest(req, res, next, schema, "body");
}

function searchSchema(req, res, next) {
    const schema = Joi.object({
        searchQuery: Joi.string().required()
    });
    validateRequest(req, res, next, schema, "query");
}

function checkUniqueSchema(req, res, next) {
    const schema = Joi.object({
        type: Joi.string().valid(...Unique_Fields).required(),
        value: Joi.string().required()
    });
    validateRequest(req, res, next, schema, "query");
}

function paginationQuerySchema(req, res, next) {
    const schema = Joi.object({
        page: Joi.number().integer().allow(null).allow(''),
        per_page: Joi.number().integer().allow(null).allow(''),
        sortOrder: Joi.string().valid('ASC', 'DESC').allow(null).allow('')
    });
    validateRequest(req, res, next, schema, "query");
}

function zipCodeSchema(req, res, next) {
    const schema = Joi.object({
        zip_code: Joi.number().integer().min(100000).max(999999).allow('').allow(null).messages({
            'number.min': 'Invalid pin code.',
            'number.max': 'Invalid pin code.'
        }),
    });
    validateRequest(req, res, next, schema, "query");
}

function zipCodeParamSchema(req, res, next) {
    const schema = Joi.object({
        zip_code: Joi.number().integer().min(100000).max(999999).required().messages({
            'number.min': 'Invalid pin code.',
            'number.max': 'Invalid pin code.'
        }),
    });
    validateRequest(req, res, next, schema, "param");
}

function dateQuerySchema(req, res, next) {
    const schema = Joi.object({
        startDate: Joi.date().required(),
        endDate: Joi.date().min(Joi.ref('startDate')).allow(null).allow('')
    });
    validateRequest(req, res, next, schema, "query");
}

module.exports = {
    idSchema,
    idQuerySchema,
    uuIdSchema,
    uuIdQuerySchema,
    orderIdQuerySchema,
    orderIdParamSchema,
    imageSchema,
    searchSchema,
    checkUniqueSchema,
    paginationQuerySchema,
    zipCodeSchema,
    zipCodeParamSchema,
    dateQuerySchema
}