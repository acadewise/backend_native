const _ = require('lodash');
const orderDao = require('./orderDao');
const userDao = require('../../user/userDao');
const { sequelize } = require('../../../models/index');
const { Order_Status, Order_type } = require('../../../constants/admin');
const orderAddressDao = require('../orderAddress/orderAddressDao');
const responseHelper = require('../../../helper/response_utility');
const { getPageAndLimit, getDateRange, validateRouteAgainstProduct } = require('../../../helper/helper_function');
const orderHelper = require('../../../helper/module_helper/order_utility');
const inventoryDao = require("./../../inventory/inventoryDao");
const moment = require('moment');
const productDao = require('./../../product/product/productDao');
const { CART_STATUS } = require('../../../constants/common');
const cartHelper = require("../../../helper/module_helper/cart_helper");
const { DELIVERY_TYPE, CART_TYPE } = require('../../../config/configuration_constant');
const userCartDao = require("./../../cart/user_cart/userCartDao");
const { processNotification } = require('../../notifications/firebase');


/**
 * Create Order.
 * @param {*} req 
 * @param {*} res 
 */
const createOrder = async (req, res) => {
    // transaction started
    const t = await sequelize.transaction();
    try {
        const orderRes = {};
        const { customer_id, cart_uuid, adjustment_amount } = req.body;

        const customer = await userDao.findById(customer_id);
        if (!customer) {
            return responseHelper.notFoundResponse(req, res, 'Invalid customer!');
        }
        const valOrder = await orderHelper.validateOrder(req);

        if (valOrder.errors) {
            return responseHelper.warningResponse(req, res, valOrder.errors, 'Order has some modifications. please review order!');
        } else {
            const orderData = valOrder.order_data;
            const itemDetails = valOrder.order_items;
            const addressDetails = valOrder.order_address;
            const paymentDetails = valOrder.order_payment;
            const orderStatus = valOrder.order_status;
            const orderTotalBreak = valOrder.order_total_break;
            const orderId = orderHelper.generateOrderNumber();

            const order = await orderHelper.setOrderData(orderId, orderData, t);
            const orderItem = await orderHelper.setOrderItems(orderId, itemDetails, t);
            const orderAddress = await orderHelper.setOrderAddresses(orderId, addressDetails, t);
            const orderPayment = await orderHelper.setOrderPayment(orderId, paymentDetails, t);
            const orderPaymentHistory = await orderHelper.setOrderPaymentHistory(orderId, customer_id, orderData,adjustment_amount, t);
            const orderStatusHistory = await orderHelper.setOrderStatusHistory(orderId, orderStatus, t);
            const orderQuantity = await orderHelper.setOrderItemsQuantity(orderId, itemDetails, t);
            if (cart_uuid) {
                const cartStatus = CART_STATUS[4];
                const updateCartStatusItem = await orderHelper.updateCartStatusItem(cart_uuid, cartStatus, t);
            }
            if (adjustment_amount && parseFloat(adjustment_amount) > 0) {
                const updateAdjustmentAmount = await orderHelper.updateUserAdjustmentAmount(customer_id, orderId, adjustment_amount, t); // updateUserAdjustmentAmount
            }


            // transaction committed.
            await t.commit();

            processNotification(customer_id, 'ORDER_CREATED', {order_id: orderId});

            orderRes['order_details'] = order;
            orderRes['order_items'] = orderItem;
            orderRes['order_address'] = orderAddress;
            orderRes['order_payment_details'] = orderPayment;
            orderRes['order_status'] = orderStatusHistory;
            orderRes['order_total_breakdown'] = orderTotalBreak;
            orderRes['order_payment_history'] = orderPaymentHistory;

            return responseHelper.successResponse(req, res, orderRes, 'Order successfully created!');
        }
    } catch (error) {
        // transaction rollback.
        await t.rollback();
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Update Order.
 * @param {*} req 
 * @param {*} res 
 */
const updateOrder = async (req, res) => {
    // transaction started
    const t = await sequelize.transaction();
    try {
        const { order_id } = req.params;
        const updates = req.body;
        const addressDetails = updates.order_address;
        delete addressDetails.id;
        const myObj = { order_id };
        const orderDetail = await orderDao.findOrderStatusByObj(myObj, t);
        if (_.isEmpty(orderDetail)) {
            return responseHelper.notFoundResponse(req, res, 'Order not found!');
        }
        const resResult = await orderHelper.processUpdateOrderAddress(order_id, orderDetail, addressDetails, t);
        if (!_.isEmpty(resResult.error)) {
            return responseHelper.badReqResponse(req, res, resResult.error);
        }
        // transaction committed.
        await t.commit();
        return responseHelper.successResponse(req, res, resResult, 'Order Address updated successfully.');
    } catch (error) {
        // transaction rollback.
        await t.rollback();
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Get order details
 * @param {*} req 
 * @param {*} res 
 */
const getOrder = async (req, res) => {
    try {
        const orderId = req.query.id;
        const orderDetail = await orderDao.findByOrderId(orderId);
        if (!orderDetail) {
            return responseHelper.notFoundResponse(req, res, 'Order not found!');
        }
        return responseHelper.successResponse(req, res, orderDetail, 'Order details successfully fetched.');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Get All orders List.
 * @param {*} req 
 * @param {*} res 
 */
const getAllOrder = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit, sortOrder } = getPageAndLimit(req);
        const orders = await orderDao.findAndCountAll(limit, page, sortOrder, req.query);
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
 * Get all order of user.
 * @param {*} req 
 * @param {*} res 
 */
const getUserOrders = async (req, res) => {
    try {
        const userId = req.query.id;
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const verifyUser = await userDao.findById(userId);
        if (!verifyUser) {
            return responseHelper.notFoundResponse(req, res, 'Invalid user!');
        }
        const userOrders = await orderDao.getUserOrder(userId, limit, page);
        const resData = {
            data: userOrders.rows,
            count: userOrders.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((userOrders.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, 'User orders successfully fetched.');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Update Order status.
 * @param {*} req 
 * @param {*} res 
 */
const updateOrderStatus = async (req, res) => {
    // transaction started
    const t = await sequelize.transaction();
    try {
        const { order_id, status } = req.params;
        const orderDetail = await orderDao.findByOrderIdT(order_id, t);
        if (_.isEmpty(orderDetail)) {
            await t.rollback();
            return responseHelper.notFoundResponse(req, res, 'Order Does not Exists!');
        }
        if (orderDetail.order_status === status) {
            await t.rollback();
            return responseHelper.badReqResponse(req, res, `Order status is already ${status}.`);
        }
        const canceledStatus = [Order_Status.CANCELLED_BY_SELLER, Order_Status.CANCELLED_BY_USER];
        if (canceledStatus.includes(orderDetail.order_status) && canceledStatus.includes(status)) {
            await t.rollback();
            return responseHelper.badReqResponse(req, res, 'Order is already canceled.');
        }
        const createdBy = req.adminData.id;

        const processOrder = await orderHelper.processOrderWithStatus(status, orderDetail, createdBy, t);
        if (_.isEmpty(processOrder)) {
            // transaction rollback.
            await t.rollback();
            return responseHelper.badReqResponse(req, res, 'Something went wrong! please try later.');
        }
        // transaction committed.
        await t.commit();
        
        processNotification(orderDetail.customer_id, 'ORDER_STATUS_CHANGED', { order_id, newStatus: status });
        
        return responseHelper.successResponse(req, res, processOrder, 'Order status successfully updated.');
    } catch (error) {
        // transaction rollback.
        await t.rollback();
        return responseHelper.internalServerError(req, res, error);
    }
}


const updateOrderStatusMultiple = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        if (req && req.body.length > 0) {
            let resData = [];
            let orderStatusIds = [];
            let resObj = req.body.map(async (order_id, index) => {
                const orderDetail = await orderDao.findByIdWithStatus(order_id, "ORDER_CREATED");
                const createdBy = req.adminData.id;
                if (orderDetail) {
                    let obj = {
                        "order_status": "ORDER_ACCEPTED",
                    }
                    await orderDao.updateOrderStatus(order_id, obj);
                    await orderHelper.createItemDeliveries(orderDetail.order_id, orderDetail, t);
                } else {
                    orderStatusIds.push(order_id);
                }
                return order_id;
            });
            await Promise.all(resObj)
            if (orderStatusIds.length > 0) {
                return responseHelper.notFoundResponse(req, res, "Status should be ORDER_ACCEPTED for the following order Ids : " + orderStatusIds);
            } else {
                return responseHelper.successResponse(req, res, resData, "Order Status Successfully updated");
            }
        } else {
            return responseHelper.notFoundResponse(req, res, "Not Found");
        }
        return;
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }

    return;
}


const addToCart = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const orderRes = {};
        const { product_id, from_date, to_date, product_type, quantity, zip_code, customer_id, product_delivery_type, auto_renew_subscription } = req.body;

        const cartItems = {
            "product_id": product_id,
            "from_date": from_date,
            "to_date": to_date,
            "product_type": product_type,
            "quantity": quantity,
            "zip_code": zip_code,
            "customer_id": customer_id,
            "product_delivery_type": product_delivery_type,
            "auto_renew_subscription": auto_renew_subscription,
            "delivery_start_date": from_date,
            "delivery_end_date": to_date,
        }

        const activeCartStatus = CART_STATUS[0];

        const productDetails = await productDao.findDeliveryRoute(product_id);
        if (productDetails) {
            const deliveryRouteIds = productDetails.delivery_route_ids;
            if (!_.isEmpty(deliveryRouteIds)) {
                const dIds = deliveryRouteIds.split(',');
                const zipCodeStatus = await validateRouteAgainstProduct(zip_code, dIds);
                if (!zipCodeStatus) {
                    return responseHelper.notFoundResponse(req, res, "Product is not deliverable at your location!");
                }
            } else {
                return responseHelper.notFoundResponse(req, res, "Product is not deliverable at your location!");
            }
        } else {
            return responseHelper.notFoundResponse(req, res, "Product is not deliverable at your location!");
        }

        let inventory_type = "";
        if (parseInt(product_type) === parseInt(1)) { /// For Variable Product 
            inventory_type = "PREDICTION";

            var startDate = moment(from_date);
            var endDate = moment(to_date);

            var now = startDate.clone(), outOfStockDateArr = [];
            while (now.isSameOrBefore(endDate)) {
                let inventoryData = {
                    product_id,
                    "inventory_type": inventory_type,
                    effective_date: now.format('YYYY-MM-DD')
                };
                let checkQuantity = await inventoryDao.getProductQuantity(inventoryData);
                let stockQuantity = checkQuantity && checkQuantity.dataValues && checkQuantity.dataValues.stock_quantity || 0;
                let customerTotalOrderPrediction = checkQuantity && checkQuantity.dataValues && checkQuantity.dataValues.customer_total_order_prediction || 0;
                let remainingQuantity = parseFloat(stockQuantity) - parseFloat(customerTotalOrderPrediction);
                if (parseInt(remainingQuantity) < parseInt(quantity)) {
                    outOfStockDateArr.push(now.format('YYYY-MM-DD'));
                }
                now.add(1, 'days');
            }

            if (outOfStockDateArr.length > 0) {
                let errMessage = "Product is out of stock for following dates " + outOfStockDateArr;
                return responseHelper.notFoundResponse(req, res, errMessage);
            } else {

                const activeCart = await userCartDao.getUserActiveCartT(customer_id, activeCartStatus, t);
                if (activeCart) {
                    const cartProdRes = await cartHelper.insertCartProduct(activeCart, cartItems, t);
                } else {
                    const deliveryType = product_delivery_type === DELIVERY_TYPE[1] ? CART_TYPE[0] : CART_TYPE[1];
                    const data = {
                        customer_id: customer_id,
                        cart_status: activeCartStatus,
                        cart_type: deliveryType,
                        created_by: Order_type.ADMIN_CREATED
                    };
                    const newCart = await userCartDao.createUserCartT(data, t);
                    const cartProdRes = await cartHelper.insertCartProduct(newCart, cartItems, t);

                }

                await t.commit();
                return responseHelper.successResponse(req, res, orderRes, 'Product is available for cart');
            }

        } else if (parseInt(product_type) === parseInt(2)) { // For Fixed Product

            let productDteail = await productDao.findById(product_id);
            if (productDteail) {
                let stockQuantity = productDteail && productDteail.dataValues && productDteail.dataValues.stock_quantity || 0;
                if (parseInt(stockQuantity) > parseInt(quantity)) {

                    const activeCart = await userCartDao.getUserActiveCartT(customer_id, activeCartStatus, t);
                    if (activeCart) {
                        const cartProdRes = await cartHelper.insertCartProduct(activeCart, cartItems, t);
                    } else {
                        const deliveryType = product_delivery_type === DELIVERY_TYPE[1] ? CART_TYPE[0] : CART_TYPE[1];
                        const data = {
                            customer_id: customer_id,
                            cart_status: activeCartStatus,
                            cart_type: deliveryType,
                            created_by: Order_type.ADMIN_CREATED
                        };
                        const newCart = await userCartDao.createUserCartT(data, t);
                        const cartProdRes = await cartHelper.insertCartProduct(newCart, cartItems, t);
                    }

                    await t.commit();
                    return responseHelper.successResponse(req, res, orderRes, 'Product is available for cart');
                } else {
                    let errMessage = "Product is out of stock ";
                    return responseHelper.notFoundResponse(req, res, errMessage);
                }
            } else {
                return responseHelper.notFoundResponse(req, res, "Not a valid product");
            }

        } else {
            return responseHelper.notFoundResponse(req, res, "Not a valid product");
        }


    } catch (error) {
        // transaction rollback.
        await t.rollback();
        return responseHelper.internalServerError(req, res, error);
    }
}


const getUserActiveCart = async (req, res) => {
    try {
        const { customer_id } = req.query;
        const activeCartStatus = CART_STATUS[0];
        if (!customer_id) {
            return responseHelper.notFoundResponse(req, res, 'Invalid user!');
        }
        const verifyUser = await userDao.findById(customer_id);
        if (!verifyUser) {
            return responseHelper.notFoundResponse(req, res, 'Invalid user!');
        }
        const cartDetail = await userCartDao.getCartByCIdCtId(customer_id, activeCartStatus);
        if (cartDetail) {
            return responseHelper.successResponse(req, res, cartDetail, "Cart details successfully fetched");
        }
        return responseHelper.notFoundResponse(req, res, 'No active cart found for customer!');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}


const modifyCartProductQuantity = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const productData = req.body;
        const customerId = productData.customer_id;
        const activeCartStatus = CART_STATUS[0];
        const cartData = await userCartDao.getCartByCIdCtIdT(customerId, activeCartStatus, t);
        if (_.isEmpty(cartData)) {
            await t.rollback();
            return responseHelper.notFoundResponse(req, res, 'Cart detail does not found!');
        }
        const modify = await cartHelper.modifyCartProduct(cartData.cart_uuid, productData, t);
        const checkStatus = await cartHelper.checkCartProductAndStatus(cartData.cart_uuid, productData, t);
        const data = {
            cart_type: checkStatus
        };
        const newStatus = await userCartDao.updateT(cartData.id, data, t);
        await t.commit();
        return responseHelper.successResponse(req, res, modify, "Cart product details successfully modified");
    } catch (error) {
        await t.rollback();
        return responseHelper.internalServerError(req, res, error);
    }
}

module.exports = {
    createOrder,
    updateOrder,
    getOrder,
    getAllOrder,
    getUserOrders,
    updateOrderStatus,
    updateOrderStatusMultiple,
    addToCart,
    getUserActiveCart,
    modifyCartProductQuantity

}