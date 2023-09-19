const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');


function createInventorySchema(req, res, next) {
    if(parseInt(req.body.product_type)===1){
        var schema = Joi.object({
            product_id: Joi.number().required(),
            product_type: Joi.number().required(),
            supplier_id: Joi.number().required(),
            total_quantity: Joi.number().allow(null).allow(0),
            stock_quantity: Joi.number().required(),
            inventory_type: Joi.string().required(),
            bill_reference_no: Joi.string().allow(null).allow(""),
            remarks: Joi.string().allow(null).allow(""),
            reason: Joi.string().allow(null).allow(""),
            from_date: Joi.date().required(),
            to_date: Joi.date().required(),
        });
    } else {
        var schema = Joi.object({
            product_id: Joi.number().required(),
            product_type: Joi.number().required(),
            supplier_id: Joi.number().required(),
            total_quantity: Joi.number().allow(null).allow(0),
            stock_quantity: Joi.number().required(),
            inventory_type: Joi.string().required(),
            bill_reference_no: Joi.string().allow(null).allow(""),
            remarks: Joi.string().allow(null).allow(""),
            reason: Joi.string().allow(null).allow(""),
            effective_date: Joi.string(),
        });
    }
    
    
    validateRequest(req, res, next, schema, "body");
}

function updateInventorySchema(req, res, next) {
    const schema = Joi.object({
        stock_quantity: Joi.number().required(),

    });
    validateRequest(req, res, next, schema, "body");
}



module.exports = {
    createInventorySchema,
    updateInventorySchema
}