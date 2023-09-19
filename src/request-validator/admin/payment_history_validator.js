const Joi = require('joi');
const { validateRequest } = require('../../helper/request_validator');


function createPaymentSchema(req, res, next) {

    var schema = Joi.object({
        customer_id: Joi.string().required(),
        order_id: Joi.string().required(),
        amount: Joi.number().required(),
        amount_type: Joi.string().required(),
        payment_note: Joi.string().required(),
        payment_remark: Joi.string().required(),

    });




    validateRequest(req, res, next, schema, "body");
}





module.exports = {
    createPaymentSchema
}