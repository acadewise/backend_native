const _ = require('lodash');
const moment = require('moment');
const orderDao = require('./orderDao');
const { sequelize } = require('../../../models/index');
const { Order_Status } = require('../../../constants/admin');
const userCartDao = require('../../cart/user_cart/userCartDao');
const responseHelper = require('../../../helper/response_utility');
const { getPageAndLimit } = require('../../../helper/helper_function');
const orderItemDeliveryDao = require('../orderItemDelivery/orderItemDeliveryDao');
const { setCartDataForCheckout, validateCartItem } = require('../../../helper/module_helper/cart_helper');
const { DEFAULT_CURRENCY, ORDER_STATUS, DELIVERY_STATUS } = require('../../../config/configuration_constant');
const { CART_STATUS, ORDER_FETCH_TYPE, ORDER_FETCH_SUBTYPE, ORDER_PAYMENT_METHOD } = require('../../../constants/common');
const { createOrderFromCart, validateCartForCheckout, processOrderWithStatus, processUpdateOrderAddress, updateOrderPaymentStatusHelper } = require('../../../helper/module_helper/order_utility');
const { createPayTmTxnToken, checkPaymentStatus } = require('../../../utils/paytm/paytm');
const { processNotification } = require('../../notifications/firebase');

/**
 * Create order for user from cart.
 * @param {*} req 
 * @param {*} res 
 */
const createUserOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let createRes;
        const customerId = req.userData.userId;
        const reqData = req.body;
        const activeCartStatus = CART_STATUS[0];
        const cartData = await userCartDao.getCartByCIdCtIdT(customerId, activeCartStatus, t);
        if (!_.isEmpty(cartData)) {
            const additionalData = {
                customer_id: customerId,
                shipping_pin_code: cartData.shipping_pin_code || reqData.shipping_pin_code,
                billing_address_id: cartData.billing_address_id || reqData.billing_address_id,
                shipping_address_id: cartData.shipping_address_id || reqData.shipping_address_id,
                coupon_code: cartData.coupon_code || null,
                include_reward_coin_pay: cartData.include_reward_coin_pay || false,
                pay_reward_coin_quantity: cartData.pay_reward_coin_quantity || 0,
                currency: cartData.currency || DEFAULT_CURRENCY,
                remote_ip: reqData.remote_ip || req.ip,
                payment_method: reqData.payment_method,
                address_details: reqData.address_details,
                cart_uuid: cartData.cart_uuid,
                cart_type: cartData.cart_type,
                adjustment_amount: reqData.adjustment_amount || 0,
                discount_amount: reqData.discount_amount || 0,
                is_weekly_planner: cartData.is_weekly_planner || false,
                adjustment_amount: reqData.adjustment_amount || 0
            }

            createRes = await createOrderFromCart(cartData, additionalData, t);
            if (createRes.is_error === true) {
                await t.rollback();
                return responseHelper.warningResponse(req, res, createRes.errors, 'Cart has some modifications, Please review before placing order.');
            }
        } else {
            await t.rollback();
            return responseHelper.notFoundResponse(req, res, 'No active cart found for this user!');
        }
        // generate transaction toke for payTm payments.
        let txnDetail = {};
        if (reqData.payment_method === "PAYTM") {
            const userData = {
                customerId: createRes.customer_id,
                amount: createRes.grand_total,
                currency: "INR"
            }
            txnDetail = await createPayTmTxnToken(createRes.order_id, userData);
            if (txnDetail === false) {
                await t.rollback();
                return responseHelper.badReqResponse(req, res, 'PayTM not working, Please use other payment method!');
            }
        }
        const orderRes = {
            order_id: createRes.order_id,
            payment_transaction_token: txnDetail.txnToken || null,
            payment_callback_url: txnDetail.callbackUrl || null,
            payment_amount: txnDetail.payment_amount,
            payment_currency: txnDetail.payment_currency || null
        }
        await t.commit();
        if (reqData.payment_method === "COD") {
            processNotification(customerId, 'ORDER_CREATED', {order_id: createRes.order_id});
        }
        return responseHelper.successResponse(req, res, orderRes, 'Order successfully created!');
    } catch (error) {
        await t.rollback();
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getCheckoutDetails = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const checkoutData = req.body;
        const customerId = req.userData.userId;
        const activeCartStatus = CART_STATUS[0];
        const cartData = await userCartDao.getCartByCIdCtIdT(customerId, activeCartStatus, t);
        if (cartData && cartData.user_cart_products) {
            const additionalData = {
                customer_id: customerId,
                shipping_pin_code: checkoutData.shipping_pin_code,
                coupon_code: checkoutData.coupon_code || null,
                include_reward_coin_pay: checkoutData.include_reward_coin_pay || false,
                pay_reward_coin_quantity: checkoutData.pay_reward_coin_quantity || 0,
                currency: checkoutData.currency || DEFAULT_CURRENCY,
                cart_type: cartData.cart_type,
                is_weekly_planner: cartData.is_weekly_planner || false
            }
            const carRes = await validateCartForCheckout(cartData.user_cart_products, additionalData);
            await setCartDataForCheckout(cartData.id, checkoutData, t);
            await t.commit();
            return responseHelper.successResponse(req, res, carRes, 'Checkout details successfully fetched.');
        } else {
            await t.rollback();
            return responseHelper.notFoundResponse(req, res, 'Cart is empty, Please add products to proceed!');
        }
    } catch (error) {
        await t.rollback();
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getAllOrders = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit, sortOrder } = getPageAndLimit(req);
        let allowOrderType;
        const user_id = req.userData.userId;
        const orderType = req.params.type;
        const subType = req.params.subType;

        let myObj = {};
        let subscriptionObj = {};
        if (subType === ORDER_FETCH_SUBTYPE[0]) {
            allowOrderType = [ORDER_STATUS[0], ORDER_STATUS[1], ORDER_STATUS[4], ORDER_STATUS[6]];
        } else {
            allowOrderType = [ORDER_STATUS[2], ORDER_STATUS[3], ORDER_STATUS[5], ORDER_STATUS[7], ORDER_STATUS[8]];
        }
        switch (orderType) {
            case ORDER_FETCH_TYPE[0]:
                const paidStatus = [ORDER_PAYMENT_METHOD[0], ORDER_PAYMENT_METHOD[1], ORDER_PAYMENT_METHOD[8], ORDER_PAYMENT_METHOD[9]]
                const unpaidStatus = ORDER_PAYMENT_METHOD.slice(2, 9);
                const payStatus = subType === ORDER_FETCH_SUBTYPE[0] ? unpaidStatus : paidStatus;
                myObj = {
                    customer_id: user_id,
                };
                subscriptionObj = {
                    is_active: true
                }
                break;
            case ORDER_FETCH_TYPE[1]:
                myObj = {
                    customer_id: user_id,
                    order_delivery_type: [ORDER_FETCH_TYPE[1], 'MIXED'],
                    order_status: allowOrderType
                };
                subscriptionObj = {
                    product_delivery_type: ["daily", "custom"],
                    is_active: true
                }
                break;
            default:
                myObj = {
                    customer_id: user_id,
                    order_status: allowOrderType
                }
                subscriptionObj = {
                    is_active: true
                }
                break;
        }
        let orders = await orderDao.findAndCountUserAllOrderWithCondition(myObj, subscriptionObj, limit, page, sortOrder);
        if (orderType === ORDER_FETCH_TYPE[0] && (subType === ORDER_FETCH_SUBTYPE[0] || subType === ORDER_FETCH_SUBTYPE[1])) {
            orders = await orderDao.dueBillPaymentOrderBase(myObj, subscriptionObj, limit, page, sortOrder);
        }


        const resData = {
            data: orders.rows,
            count: orders.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((orders.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, 'Orders successfully fetched.');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getOrderDetail = async (req, res) => {
    try {
        const orderId = req.params.order_id;
        const user_id = req.userData.userId;
        const orderDetail = await orderDao.findByOrderAndUserId(orderId, user_id);
        if (!orderDetail) {
            return responseHelper.notFoundResponse(req, res, 'Order not found!');
        }
        return responseHelper.successResponse(req, res, orderDetail, 'Order details successfully fetched.');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const cancelCustomerOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { order_id } = req.params;
        const customer_id = req.userData.userId;
        const orderDetail = await orderDao.findByOrderIdCustomerIdT(order_id, customer_id, t);
        if (_.isEmpty(orderDetail)) {
            await t.rollback();
            return responseHelper.notFoundResponse(req, res, 'Order does not Exists!');
        }
        const status = Order_Status.CANCELLED_BY_USER;
        const canceledStatus = [Order_Status.CANCELLED_BY_SELLER, Order_Status.CANCELLED_BY_USER];
        if (canceledStatus.includes(orderDetail.order_status) && canceledStatus.includes(status)) {
            await t.rollback();
            return responseHelper.badReqResponse(req, res, 'Order is already canceled!');
        }
        const createdBy = customer_id;
        const processOrder = await processOrderWithStatus(status, orderDetail, createdBy, t);
        if (_.isEmpty(processOrder)) {
            await t.rollback();
            return responseHelper.badReqResponse(req, res, 'Something went wrong! please try later.');
        }
        await t.commit();

        processNotification(customer_id, 'ORDER_STATUS_CHANGED', { order_id, newStatus: status });

        return responseHelper.successResponse(req, res, { order_id }, 'Order cancelled successfully.');
    } catch (error) {
        await t.rollback();
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const updateCustomerOrderAddress = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { order_id } = req.params;
        const customer_id = req.userData.userId;
        const updates = req.body;
        const addressDetails = updates.order_address;
        delete addressDetails.id;
        const myObj = { order_id, customer_id };
        const orderDetail = await orderDao.findOrderStatusByObj(myObj, t);
        if (_.isEmpty(orderDetail)) {
            await t.rollback();
            return responseHelper.notFoundResponse(req, res, 'Order not found!');
        }
        const validationError = [];
        for (let item of orderDetail.Order_items) {
            const prodValidation = await validateCartItem(item.ordered_item_id, addressDetails.delivery_pincode, item);
            if (!_.isEmpty(prodValidation)) {
                validationError.push(prodValidation);
            }
        }
        if (!_.isEmpty(validationError)) {
            await t.rollback();
            return responseHelper.badReqResponse(req, res, 'Address can not be changed as some item inside this order can not be shipped on given location!');
        }
        const resResult = await processUpdateOrderAddress(order_id, orderDetail, addressDetails, t);
        if (!_.isEmpty(resResult.error)) {
            await t.rollback();
            return responseHelper.badReqResponse(req, res, resResult.error);
        }
        await t.commit();
        return responseHelper.successResponse(req, res, { order_id }, 'Order Address updated successfully.');
    } catch (error) {
        await t.rollback();
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getCalenderOrders = async (req, res) => {
    try {
        const zipCode = req.params.zip_code;
        const customer_id = req.userData.userId;
        const { startDate, endDate } = req.query;

        const newStartDate = moment(startDate, 'YYYY-MM-DD');

        let orderData;
        if (startDate && endDate) {
            orderData = await orderItemDeliveryDao.getCalenderData(customer_id, zipCode, startDate, endDate);
        } else {
            const startOfMonth = moment(newStartDate).clone().startOf('month').format('YYYY-MM-DD');
            const endOfMonth = moment(newStartDate).clone().endOf('month').format('YYYY-MM-DD');
            orderData = await orderItemDeliveryDao.getCalenderData(customer_id, zipCode, startOfMonth, endOfMonth);
        }
        return responseHelper.successResponse(req, res, orderData, 'Calendar orders fetched successfully.');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

const getAllWeeklyOrders = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit, sortOrder } = getPageAndLimit(req);
        let allowOrderType;
        const user_id = req.userData.userId;
        const orderType = req.params.type;
        const subType = req.params.subType;
        let myObj = {};
        if (subType === ORDER_FETCH_SUBTYPE[0]) {
            allowOrderType = [ORDER_STATUS[0], ORDER_STATUS[1], ORDER_STATUS[4], ORDER_STATUS[6]];
        } else {
            allowOrderType = [ORDER_STATUS[2], ORDER_STATUS[3], ORDER_STATUS[5], ORDER_STATUS[7], ORDER_STATUS[8]];
        }
        switch (orderType) {
            case ORDER_FETCH_TYPE[0]:
                const paidStatus = [ORDER_PAYMENT_METHOD[0], ORDER_PAYMENT_METHOD[1], ORDER_PAYMENT_METHOD[8], ORDER_PAYMENT_METHOD[9]]
                const unpaidStatus = ORDER_PAYMENT_METHOD.slice(2, 9);
                const payStatus = subType === ORDER_FETCH_SUBTYPE[0] ? unpaidStatus : paidStatus;
                myObj = {
                    customer_id: user_id,
                    payment_status: payStatus,
                    order_status: allowOrderType,
                    is_weekly_planner: true
                }
                break;
            case ORDER_FETCH_TYPE[1]:
                myObj = {
                    customer_id: user_id,
                    order_delivery_type: ORDER_FETCH_TYPE[0],
                    order_status: allowOrderType,
                    is_weekly_planner: true
                }
                break;
            default:
                myObj = {
                    customer_id: user_id,
                    order_status: allowOrderType,
                    is_weekly_planner: true
                }
                break;
        }
        const orders = await orderDao.findAndCountUserAllWeeklyOrderWithCondition(myObj, limit, page, sortOrder);
        const resData = {
            data: orders.rows,
            count: orders.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((orders.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, 'Orders successfully fetched.');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

const getSubscriptionOrderDetail = async (req, res) => {
    try {
        const orderId = req.params.order_id;
        const user_id = req.userData.userId;
        const orderDetail_Data = await orderDao.findByOrderId(orderId);
        //ORDER_STATUS[0], ORDER_STATUS[1]
        const order_Status = orderDetail_Data?.order_status || ORDER_STATUS[0];
        let orderDetail;
        if (order_Status === ORDER_STATUS[1]) {
            orderDetail = await orderDao.findBySubscriptionOrderAndUserId(orderId, user_id);
        } else {
            orderDetail = await orderDao.findSubscriptionOrderItems(orderId, user_id);
        }

        if (!orderDetail) {
            return responseHelper.notFoundResponse(req, res, 'Order not found!');
        }
        return responseHelper.successResponse(req, res, orderDetail, 'Order details successfully fetched.');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

const cancelOrderDelivery = async (req, res) => {
    try {
        const { order_id, product_id, delivery_date } = req.body;
        const customer_id = req.userData.userId;
        const deliveryData = await orderItemDeliveryDao.findByDateOidPidCid(order_id, customer_id, product_id, delivery_date);
        if (!deliveryData) {
            return responseHelper.notFoundResponse(req, res, 'Invalid customer order!');
        }
        const upObj = {
            delivery_status: DELIVERY_STATUS[4]
        }
        await orderItemDeliveryDao.update(deliveryData.id, upObj);
        return responseHelper.successResponse(req, res, {}, 'Order details successfully fetched.');
    } catch (e) {
        console.error(e);
        return responseHelper.internalServerError(req, res, error);
    }
}

const updateOrderPaymentStatus = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { order_id } = req.params;
        const { payment_method, payment_status, payment_payload } = req.body;
        const customerId = req.userData.userId;
        const orderDetails = await orderDao.findByCidOid(order_id, customerId);
        if (!orderDetails) {
            await t.rollback();
            return responseHelper.notFoundResponse(req, res, 'Invalid customer order.');
        }
        let orderRes = {
            order_id,
            payment_amount: orderDetails.grand_total,
            payment_currency: orderDetails.currency || 'INR'
        };
        const payload = {
            customerId,
            paymentMethod: payment_method,
            paymentStatus: payment_status,
            orderDetails,
            paymentDetails: '{}'
        }
        if (payment_method === 'COD') {
            await updateOrderPaymentStatusHelper(payload, t);
        } else if (payment_method === 'PAYTM') {
            const checkStatus = await checkPaymentStatus(order_id);
            payload.paymentDetails = checkStatus || payment_payload;
            await updateOrderPaymentStatusHelper(payload, t);
            processNotification(customerId, 'ORDER_CREATED', { order_id });
        }
        await t.commit();
        return responseHelper.successResponse(req, res, orderRes, 'Order payment status successfully updated.');
    } catch (e) {
        await t.rollback();
        console.error(e);
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const createOrderTxnToken = async (req, res) => {
    try {
        const { order_id } = req.params;
        const customerId = req.userData.userId;
        const orderDetails = await orderDao.findByCidOid(order_id, customerId);
        if (!orderDetails) {
            return responseHelper.notFoundResponse(req, res, 'Invalid customer order.');
        }
        const userData = {
            customerId: customerId,
            amount: orderDetails.grand_total,
            currency: "INR"
        }
        const txnDetail = await createPayTmTxnToken(order_id, userData);
        if (txnDetail === false) {
            return responseHelper.badReqResponse(req, res, 'PayTM not working, Please use other payment method!');
        }
        const orderRes = {
            order_id,
            payment_transaction_token: txnDetail.txnToken || null,
            payment_callback_url: txnDetail.callbackUrl || null,
            payment_amount: txnDetail.payment_amount,
            payment_currency: txnDetail.payment_currency || null
        }
        return responseHelper.successResponse(req, res, orderRes, 'PayTm transaction token generated successfully.');
    } catch (e) {
        console.error(e);
        return responseHelper.internalServerError(req, res, error);
    }
}

module.exports = {
    createUserOrder,
    getCheckoutDetails,
    getAllOrders,
    getOrderDetail,
    cancelCustomerOrder,
    updateCustomerOrderAddress,
    getCalenderOrders,
    getAllWeeklyOrders,
    getSubscriptionOrderDetail,
    cancelOrderDelivery,
    updateOrderPaymentStatus,
    createOrderTxnToken
}