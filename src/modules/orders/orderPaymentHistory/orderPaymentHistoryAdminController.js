const orderPaymentHistoryDao = require("./orderPaymentHistoryDao");
const responseHelper = require('../../../helper/response_utility');
const { getPageAndLimit } = require('../../../helper/helper_function');
const orderDao = require('../order/orderDao');
const userDao = require('../../user/userDao');
const deliveryPointAddressDao = require('../../delivery_point_address/deliveryPointAddressDao');
const adminDao = require('../../admin/adminDao');

/**
 * Create supplier.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createPaymentHistory = async (req, res) => {
    try {

        const { order_id, customer_id, amount, amount_type, payment_note, payment_remark, payment_mode, transaction_remark } = req.body;
        const requestData = {
            order_id,
            customer_id,
            amount,
            amount_type,
            payment_note,
            payment_remark,
            payment_mode,
            transaction_remark

        };


        const customer = await userDao.findById(customer_id);
        if (!customer) {
            return responseHelper.notFoundResponse(req, res, 'Invalid customer!');
        }

        const order = await orderDao.findByOrderIdCustomerIdT(order_id, customer_id);
        if (!order) {
            return responseHelper.notFoundResponse(req, res, 'Invalid order!');
        }


        const resData = await orderPaymentHistoryDao.create(requestData);
        return responseHelper.successResponse(req, res, resData, "Payment history successfully created");


    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Get All suppliers list.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllPaymentHistory = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };
        const paymentHistory = await orderPaymentHistoryDao.findAllHistory(req.query, attributes, page, limit);
        const totalCreditAmount = await orderPaymentHistoryDao.totalCreditAmount(req.query);
        const totalDebitAmount = await orderPaymentHistoryDao.totalDebitAmount(req.query);
        let data = paymentHistory.rows;

        const resData = {
            data: paymentHistory.rows,
            count: paymentHistory.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((paymentHistory.count / limit)),
            totalCreditAmount,
            totalDebitAmount
        }


        return responseHelper.successResponseWithAddtionalField(req, res, resData, "Payment History records successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

const getSinglePaymentHistory = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };
        const totalCreditAmount = await orderPaymentHistoryDao.totalCreditAmount(req.query);
        const totalDebitAmount = await orderPaymentHistoryDao.totalDebitAmount(req.query);
        let data = { ...totalCreditAmount[0], ...totalDebitAmount[0] };

        const resData = {
            data
        }


        return responseHelper.successResponseWithAddtionalField(req, res, resData, "Payment History records successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}


/**
 * Get suppliers details by Id.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getOrderPaymentHistoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const deliveryItemData = await orderPaymentHistoryDao.findByOrderId(id);
        if (!deliveryItemData) {
            return responseHelper.notFoundResponse(req, res, "Payment History Data not found!");
        }
        return responseHelper.successResponse(req, res, deliveryItemData, "Payment History data successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

const checkSinglePaymentHistory = async (req) => {
    try {
        const query = {
            customer_id: req.customer_id
        }
        const totalCreditAmount = await orderPaymentHistoryDao.totalCreditAmount(query);
        const totalDebitAmount = await orderPaymentHistoryDao.totalDebitAmount(query);
        let data = { ...totalCreditAmount[0], ...totalDebitAmount[0] };

        const resData = {
            data
        }


        return resData;
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}


module.exports = {
    createPaymentHistory,
    getAllPaymentHistory,
    getOrderPaymentHistoryById,
    getSinglePaymentHistory,
    checkSinglePaymentHistory

};
