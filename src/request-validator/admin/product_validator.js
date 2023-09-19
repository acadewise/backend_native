const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');

function createProductSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().max(200).required(),
        description: Joi.string().required(),
        delivery_route_ids: Joi.string().required(),
        is_active: Joi.boolean().allow(null).allow(""),
        stock_status: Joi.boolean().allow(null).allow(""),
        barcode: Joi.string().allow(null).allow(""),
        product_measurement_unit: Joi.number().integer().required(),
        max_retail_price: Joi.number().required(),
        product_cost_price: Joi.number().required(),
        special_sale_price: Joi.number().required(),
        is_on_sale: Joi.boolean().allow(null).allow(""),
        min_buy_quantity: Joi.number().integer().required().min(1),
        max_buy_quantity: Joi.number().integer().allow(null).allow(0).allow(""),
        available_time_starts: Joi.string().allow(null).allow(""),
        available_time_ends: Joi.string().allow(null).allow(""),
        brand_id: Joi.number().integer().allow(0).allow(null).allow(""),
        is_variations: Joi.boolean().allow(null).allow(""),
        is_searchable: Joi.boolean().allow(null).allow(""),
        is_show_on_list: Joi.boolean().allow(null).allow(""),
        is_featured: Joi.boolean().allow(null).allow(""),
        add_ons: Joi.number().integer().allow(null).allow("").allow(0),
        tax: Joi.number().integer().allow(null).allow(0),
        product_images: Joi.array().items({
            type: Joi.string().valid('image', 'video').required(),
            url: Joi.string().required(),
            position: Joi.number().integer().allow(null).allow(''),
            is_active: Joi.boolean().allow(null).allow('')
        }).min(1),
        product_category: Joi.array().items(Joi.number().integer()).allow(null),
        product_tags: Joi.array().items(Joi.number().integer()).allow(null),
        product_configuration_rules: Joi.array().items(Joi.number().integer()).allow(null).allow(' '),
        product_attributes: Joi.array().items({
            attribute_id: Joi.number().integer().required(),
            values: Joi.array().items(Joi.number().integer()).min(1)
        }).allow(null)
    });
    validateRequest(req, res, next, schema, "body");
}

function updateProductSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().max(200),
        description: Joi.string(),
        delivery_route_ids: Joi.string().required(),
        is_active: Joi.boolean(),
        stock_status: Joi.boolean(),
        barcode: Joi.string(),
        product_measurement_unit: Joi.number().integer(),
        max_retail_price: Joi.number(),
        product_cost_price: Joi.number(),
        special_sale_price: Joi.number(),
        is_on_sale: Joi.boolean(),
        min_buy_quantity: Joi.number().min(1),
        max_buy_quantity: Joi.number().integer(),
        available_time_starts: Joi.string(),
        available_time_ends: Joi.string(),
        brand_id: Joi.number().integer(),
        is_variations: Joi.boolean(),
        is_searchable: Joi.boolean(),
        is_show_on_list: Joi.boolean(),
        is_featured: Joi.boolean(),
        add_ons: Joi.number().integer(),
        tax: Joi.number().integer(),
        product_images: Joi.array().items({
            id: Joi.number().integer(),
            type: Joi.string().valid('image', 'video'),
            url: Joi.string(),
            position: Joi.number().integer(),
            is_active: Joi.boolean()
        }),
        product_category: Joi.array().items({
            id: Joi.number().integer(),
            category_id: Joi.number().integer(),
            is_active: Joi.boolean()
        }),
        product_tags: Joi.array().items({
            id: Joi.number().integer(),
            item_id: Joi.number().integer(),
            tag_id: Joi.number().integer(),
            is_active: Joi.boolean()
        }),
        product_configuration_rules: Joi.array().items({
            id: Joi.number().integer(),
            product_id: Joi.number().integer(),
            rule_id: Joi.number().integer(),
            is_active: Joi.boolean()
        }),
        product_attributes: Joi.array().items({
            attribute_id: Joi.number().integer(),
            values: Joi.array().items(Joi.number().integer()).allow(null).allow({})
        })
    });
    validateRequest(req, res, next, schema, "body");
}


function updateProdImgSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        price: Joi.number().min(0),
        category_id: Joi.number(),
        variations: Joi.string(),
        tax: Joi.number().min(0),
        available_time_starts: Joi.string(),
        available_time_ends: Joi.string(),
        status: Joi.string()
    });
    validateRequest(req, res, next, schema, "body");
}

module.exports = {
    createProductSchema,
    updateProductSchema,
    updateProdImgSchema
}