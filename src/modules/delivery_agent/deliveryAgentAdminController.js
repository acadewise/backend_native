const deliveryAgentDao = require("./deliveryAgentDao");
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');
const orderDao = require('../orders/order/orderDao');
const orderPaymentHistoryDao = require('../orders/orderPaymentHistory/orderPaymentHistoryDao');
const userDao = require('../user/userDao');
const deliveryPointAddressDao = require('../delivery_point_address/deliveryPointAddressDao');
const adminDao = require('../admin/adminDao');
const inventoryDao = require("./../inventory/inventoryDao");
const moment = require('moment');
const { Order_Status } = require("../../constants/admin");
const { updateOrderStatusAfterDelivery } = require('../../helper/module_helper/order_utility');
const { processNotification } = require('../notifications/firebase');

/**
 * Create supplier.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createOrderDeliveryAgent = async (req, res) => {
    try {
        const { id, order_id, delivery_agent_id, user_id, delivery_status, remark } = req.body;
        const updatedBy = req.adminData.id;
        const requestData = {
            id,
            order_id,
            delivery_agent_id,
            user_id,
            delivery_status,
            remark
        };

        const order = await orderDao.findByOrderId(order_id);

        if (!order) {
            return responseHelper.notFoundResponse(req, res, 'Invalid order!');
        }

        const checkDeliveryganet = await deliveryAgentDao.checkAlreadyExits(id, order_id, user_id, delivery_agent_id);

        if (checkDeliveryganet) {

            const resData = await deliveryAgentDao.update(id, requestData);

            await updateOrderStatusAfterDelivery(order, updatedBy);

            if (resData) {
                if (requestData.delivery_status === 'DELIVERED') {
                    const inventoryData = {
                        product_id: checkDeliveryganet.product_id,
                        supplier_id: 0,
                        stock_quantity: checkDeliveryganet.quantity,
                        inventory_type: "OUT",
                        bill_reference_no: "",
                        remarks: "Order Placed",
                        reason: "Order Update By Delivery Boy",
                        effective_date: moment().format("YYYY-MM-DD"),
                    };
                    const inventoryRes = await inventoryDao.create(inventoryData);
                }

                let paramsObj = {
                    customer_id: user_id,
                    order_id: order_id
                }

                let totalCreditAmount = await orderPaymentHistoryDao.totalCreditAmount(paramsObj);
                let totalDebitAmount = await orderPaymentHistoryDao.totalDebitAmount(paramsObj);

                if (totalCreditAmount && totalDebitAmount) {
                    let cr_due = totalCreditAmount && totalCreditAmount[0] && parseFloat(totalCreditAmount[0].cr_due) || 0;
                    let cr_advance = totalCreditAmount && totalCreditAmount[0] && parseFloat(totalCreditAmount[0].cr_advance) || 0;
                    let cr_adjustment = totalCreditAmount && totalCreditAmount[0] && parseFloat(totalCreditAmount[0].cr_adjustment) || 0;
                    let dr_due = totalDebitAmount && totalDebitAmount[0] && parseFloat(totalDebitAmount[0].dr_due) || 0;
                    let dr_advance = totalDebitAmount && totalDebitAmount[0] && parseFloat(totalDebitAmount[0].dr_advance) || 0;
                    let dr_adjustment = totalDebitAmount && totalDebitAmount[0] && parseFloat(totalDebitAmount[0].dr_adjustment) || 0;

                    let total_due_amount = parseFloat(cr_due) - parseFloat(dr_due);
                    let total_advance_amount = parseFloat(cr_advance) - parseFloat(dr_advance);
                    let itemPrice = parseFloat(checkDeliveryganet.amount_to_be_collected) * parseFloat(checkDeliveryganet.quantity) || 0;

                    let finalObj = {};
                    let finalObjAdvance = {};
                    let bulkCreateArr = [];

                    if (total_advance_amount > 0 && total_advance_amount >= itemPrice && requestData.delivery_status === 'DELIVERED') {
                        finalObj = {
                            customer_id: user_id,
                            order_id: order_id,
                            amount: itemPrice,
                            amount_type: "DR",
                            payment_note: "ADVANCE",
                            payment_remark: "Debit With Advance Amount"
                        };
                        bulkCreateArr.push(finalObj);
                    } else if (total_advance_amount > 0 && total_advance_amount >= itemPrice && requestData.delivery_status === 'DELIVERY_MISSED') {
                        finalObj = {
                            customer_id: user_id,
                            order_id: order_id,
                            amount: itemPrice,
                            amount_type: "CR",
                            payment_note: "ADJUSTMENT",
                            payment_remark: "Credit With Adjustment Amount"
                        };
                        bulkCreateArr.push(finalObj);
                    } else if (total_advance_amount > 0 && total_advance_amount < itemPrice && requestData.delivery_status === 'DELIVERED') {
                        finalObj = {
                            customer_id: user_id,
                            order_id: order_id,
                            amount: total_advance_amount,
                            amount_type: "DR",
                            payment_note: "ADVANCE",
                            payment_remark: "Debit With Advance Amount"
                        };
                        finalObjAdvance = {
                            customer_id: user_id,
                            order_id: order_id,
                            amount: itemPrice - total_advance_amount,
                            amount_type: "DR",
                            payment_note: "DUE",
                            payment_remark: "Credit With Due Amount"
                        }
                        bulkCreateArr.push(finalObj, finalObjAdvance);
                    } else if (total_advance_amount > 0 && total_advance_amount < itemPrice && requestData.delivery_status === 'DELIVERY_MISSED') {
                        finalObj = {
                            customer_id: user_id,
                            order_id: order_id,
                            amount: total_advance_amount,
                            amount_type: "CR",
                            payment_note: "ADJUSTMENT",
                            payment_remark: "Credit With Adjustment Amount"
                        };
                        bulkCreateArr.push(finalObj);
                    } else if (total_due_amount >= itemPrice && requestData.delivery_status === 'DELIVERED') {
                        finalObj = {
                            customer_id: user_id,
                            order_id: order_id,
                            amount: itemPrice,
                            amount_type: "DR",
                            payment_note: "DUE",
                            payment_remark: "Credit With Due Amount"
                        };
                        bulkCreateArr.push(finalObj);
                    }
                    orderPaymentHistoryDao.bulkCreate(bulkCreateArr);
                }
            }
            
            processNotification(user_id, 'ORDER_DELIVERY', { order_id, deliveryStatus: delivery_status });

            return responseHelper.successResponse(req, res, resData, "Order Status successfully created");
        } else {
            const resData = [];
            return responseHelper.successResponse(req, res, resData, "No records found");
        }

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
const getAllOrderDeliveryAgent = async (req, res) => {
    try {

        const delivery_agent_id = req.query && req.query.agent_id || null;


        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);

        const deliveryAgent = await adminDao.findById(delivery_agent_id);
        if (!deliveryAgent) {
            return responseHelper.notFoundResponse(req, res, 'Invalid delivery agent!');
        }

        const addressList = await deliveryAgentDao.findAllOrderDeliveryAgentPagination(req.query, page, limit)
        const resData = {
            data: addressList.rows,
            count: addressList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((addressList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "Orders records successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}


const getAllOrderDeliveryReports = async (req, res) => {
    try {

        let query = req.query;
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);

        const addressList = await deliveryAgentDao.findAllDeliveryReportsAndPagination(query, page, limit)
        const resData = {
            data: addressList.rows,
            count: addressList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((addressList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "Orders records successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

const getAllOrderDeliveryItemsReports = async (req, res) => {
    try {
        let query = req.query;
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const addressList = await deliveryAgentDao.findAllDeliveryItemsReportsAndPagination(query, page, limit)
        const resData = {
            data: addressList.rows,
            count: addressList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((addressList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "Orders records successfully fetched");
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
const getOrderDeliveryAgentById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplierData = await deliveryAgentDao.findById(id);
        if (!supplierData) {
            return responseHelper.notFoundResponse(req, res, "delivery route Data not found!");
        }
        return responseHelper.successResponse(req, res, supplierData, "delivery route data successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}


const getDeliveryAgentRoutes = async (req, res) => {
    try {

        const delivery_agent_id = req.query && req.query.agent_id || null;

        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);

        const deliveryAgent = await adminDao.findById(delivery_agent_id);
        if (!deliveryAgent) {
            return responseHelper.notFoundResponse(req, res, 'Invalid delivery agent!');
        }

        const addressList = await deliveryAgentDao.findDeliveryAgentRoutes(delivery_agent_id, page, limit)
        const resData = {
            data: addressList.rows,
            count: addressList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((addressList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "Orders records successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}



/**
 * Soft Delete supplier.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deleteOrderDeliveryAgent = async (req, res) => {
    try {
        const { id } = req.params;
        const routeData = await deliveryAgentDao.findById(id);
        if (!routeData) {
            return responseHelper.notFoundResponse(req, res, "route Data not found!");
        }
        const routeRes = await deliveryAgentDao.softDelete(routeData.id);
        return responseHelper.successResponse(req, res, routeRes, "route successfully deleted");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

module.exports = {
    createOrderDeliveryAgent,
    getAllOrderDeliveryAgent,
    getOrderDeliveryAgentById,
    deleteOrderDeliveryAgent,
    getAllOrderDeliveryReports,
    getAllOrderDeliveryItemsReports,
    getDeliveryAgentRoutes
};
