const _ = require('lodash');
const moment = require('moment');
const userCartDao = require("./userCartDao");
const userDao = require("../../user/userDao");
const { sequelize } = require("../../../models/index");
const { CART_STATUS } = require("../../../constants/common");
const cartProductDao = require('../cart_product/cartProductDao');
const responseHelper = require("../../../helper/response_utility");
const cartHelper = require("../../../helper/module_helper/cart_helper");
const { DELIVERY_TYPE, CART_TYPE } = require('../../../config/configuration_constant');
const { findDeliveryRoute } = require('../../product/product/productDao');
const couponMasterDao = require('../../../modules/coupon_master/couponMasterDao');
const { findForCustomerOrderT } = require('../../orders/order/orderDao');

/**
 * create user cart.
 * @param {*} req 
 * @param {*} res 
 */
const createUserCart = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let cartRes;
        const cartData = req.body;
        const cartItems = cartData.cart_products;
        const zipCode = parseInt(cartData.zip_code);
        const activeCartStatus = CART_STATUS[0];
        const customerId = req.userData.userId;
        const customer = await userDao.findById(customerId);
        if (!customer) {
            await t.rollback();
            return responseHelper.notFoundResponse(req, res, 'Invalid customer!');
        }

        const productDetails = await findDeliveryRoute(cartItems.product_id);
        if (!productDetails) {
            await t.rollback();
            return responseHelper.notFoundResponse(req, res, 'Product is no longer available! Please try after some time');
        }
        const activeCart = await userCartDao.getUserActiveCartT(customerId, activeCartStatus, t);
        const validateCartProd = await cartHelper.validateCartItem(cartItems.product_id, zipCode, cartItems);
        if (validateCartProd.length) {
            await t.rollback();
            return responseHelper.badReqResponse(req, res, validateCartProd[0].error);
        }

        const productData = productDetails && productDetails.dataValues;
        if (activeCart) {
            const cartProdRes = await cartHelper.insertCartProduct(activeCart, cartItems, t);
            const checkStatus = await cartHelper.checkCartProductAndStatus(activeCart.cart_uuid, cartItems, t);
            const data = {
                cart_type: checkStatus,
                is_weekly_planner: cartData.is_weekly_planner || false
            };
            const newCart = await userCartDao.updateT(activeCart.id, data, t);
            cartRes = cartProdRes;
        } else {
            const itemStatus = cartItems.product_delivery_type;
            const deliveryType = cartHelper.getCartDeliveryType(itemStatus);
            const data = {
                customer_id: customerId,
                cart_status: activeCartStatus,
                cart_type: deliveryType,
                is_weekly_planner: cartData.is_weekly_planner || false
            };
            const newCart = await userCartDao.createUserCartT(data, t);
            const cartProdRes = await cartHelper.insertCartProduct(newCart, cartItems, t);
            cartRes = cartProdRes;
        }

        // Update Quantity
        if (parseInt(productData.product_type) === 1) { /// For Variable Product
            let newObjCart = {
                ordered_item_id: cartItems.product_id,
                quantity: cartItems.quantity,
                delivery_start_date: cartItems.delivery_start_date,
                delivery_end_date: cartItems.delivery_end_date,
            }
            let updateQuantity = await cartHelper.setQuantityForVariableProduct(newObjCart, t);
        } else {
            let newObjCart = {
                ordered_item_id: cartItems.product_id,
                quantity: cartItems.quantity
            }
            let updateQuantity = await cartHelper.setQuantityForFixedProduct(newObjCart, t);
        }

        await t.commit();
        return responseHelper.successResponse(req, res, cartRes, 'Item successfully added to cart.');
    } catch (error) {
        await t.rollback();
        return responseHelper.internalServerError(req, res, error);
    }
}


const getUserActiveCart = async (req, res) => {
    try {
        const customerId = req.userData.userId;
        const activeCartStatus = CART_STATUS[0];
        const cartDetail = await userCartDao.getCartByCIdCtId(customerId, activeCartStatus);
        if (cartDetail) {
            return responseHelper.successResponse(req, res, cartDetail, "Cart details successfully fetched");
        }
        return responseHelper.notFoundResponse(req, res, 'No active cart found for customer!');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const modifyCartProductQuantity = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const productData = req.body;
        const customerId = req.userData.userId;
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

/**
 * Clear all cart products.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const clearAllCartProducts = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const customerId = req.userData.userId;
        const activeCartStatus = CART_STATUS[0];
        const cartData = await userCartDao.getCartByCIdCtIdT(customerId, activeCartStatus, t);
        if (_.isEmpty(cartData)) {
            await t.rollback();
            return responseHelper.notFoundResponse(req, res, 'Cart detail does not found!');
        }
        const upObj = {
            is_active: false
        }
        const [count, update] = await cartProductDao.updateByCartUuidT(cartData.cart_uuid, upObj, t);
        await t.commit();
        return responseHelper.successResponse(req, res, {}, "Cart data cleared successfully.");
    } catch (error) {
        await t.rollback();
        return responseHelper.internalServerError(req, res, error);
    }
}

const deleteCartItem = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const productData = req.body;

        const customerId = req.userData.userId;
        const activeCartStatus = CART_STATUS[0];
        const cartData = await cartProductDao.getCartProduct(productData.cart_id, productData.id, t);
        if (_.isEmpty(cartData)) {
            await t.rollback();
            return responseHelper.notFoundResponse(req, res, 'Cart detail does not found!');
        }
        const upObj = {
            is_active: false
        }
        const [count, update] = await cartProductDao.updateT(cartData.id, upObj, t);
        await t.commit();
        return responseHelper.successResponse(req, res, {}, "Cart data cleared successfully.");
    } catch (error) {
        await t.rollback();
        return responseHelper.internalServerError(req, res, error);
    }
}
const getUserActiveWeeklyCart = async (req, res) => {
    try {
        const customerId = req.userData.userId;
        const activeCartStatus = CART_STATUS[0];
        const cartDetail = await userCartDao.getWeeklyCartByCIdCtId(customerId, activeCartStatus);
        if (cartDetail) {
            return responseHelper.successResponse(req, res, cartDetail, "Cart details successfully fetched");
        }
        return responseHelper.notFoundResponse(req, res, 'No active cart found for customer!');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

const getCoupenDetails = async (req, res) => {
    try {
        let coupon_code = req?.query?.coupen_code || '';

        const coupenDetail = await couponMasterDao.findByCoupon_Code(coupon_code);

        if (coupenDetail) {
            return responseHelper.successResponse(req, res, coupenDetail, "Coupen details successfully fetched");
        }
        return responseHelper.notFoundResponse(req, res, 'Not a valid coupen!');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

const cloneOrderToCart = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { orderId } = req.params;
        const customerId = req.userData.userId;
        const orderDetails = await findForCustomerOrderT(orderId, customerId, t);
        if (!orderDetails) {
            await t.rollback();
            return responseHelper.notFoundResponse(req, res, 'Invalid customer order!');
        }
        if (orderDetails.order_delivery_type === CART_TYPE[2] || orderDetails.order_delivery_type === CART_TYPE[3]) {
            await t.rollback();
            return responseHelper.notFoundResponse(req, res, "Custom and Mixed orders can't be copied to cart.");
        }
        const activeCartStatus = CART_STATUS[0];
        let activeCart = await userCartDao.getUserActiveCartT(customerId, activeCartStatus, t);
        if (!_.isEmpty(activeCart) && orderDetails.order_delivery_type !== activeCart.cart_type) {
            await t.rollback();
            return responseHelper.badReqResponse(req, res, `Cart already have some items, Please clear cart to copy this order.`);
        }
        if (_.isEmpty(activeCart)) {
            const data = {
                customer_id: customerId,
                cart_status: activeCartStatus,
                cart_type: orderDetails.order_delivery_type,
                is_weekly_planner: false,
            };
            const newCart = await userCartDao.createUserCartT(data, t);
            activeCart = newCart;
        }
        const cartItems = orderDetails.Order_items.map(x => {
            if (orderDetails.order_delivery_type === CART_TYPE[0]) {
                return {
                    cart_id: activeCart.id, 
                    cart_uuid: activeCart.cart_uuid, 
                    product_id: x.ordered_item_id, 
                    quantity: x.quantity, 
                    is_active: x.is_active, 
                    product_delivery_type: x.product_delivery_type, 
                    delivery_start_date: null, 
                    delivery_end_date: null, 
                    delivery_time_slot: null, 
                    auto_renew_subscription: x.auto_renew_subscription || false,
                }
            } else {
                const nextDay = moment(x.delivery_end_date, 'YYYY-MM-DD').add(1, 'd');
                const lastDay = moment(x.delivery_end_date, 'YYYY-MM-DD').add(30, 'd');
                return {
                    cart_id: activeCart.id, 
                    cart_uuid: activeCart.cart_uuid, 
                    product_id: x.ordered_item_id, 
                    quantity: x.quantity, 
                    is_active: x.is_active, 
                    product_delivery_type: x.product_delivery_type, 
                    delivery_start_date: nextDay.toDate(), 
                    delivery_end_date: lastDay.toDate(), 
                    delivery_time_slot: x.delivery_time, 
                    auto_renew_subscription: x.auto_renew_subscription || false,
                }
            }
        });
        for (let item of cartItems) {
            await cartHelper.insertCartProduct(activeCart, item, t);
        }
        await t.commit();
        return responseHelper.successResponse(req, res, {}, "Order successfully cloned to cart.");
    } catch(e) {
        console.error(e);
        await t.rollback();
        return responseHelper.internalServerError(req, res, error);
    }
}


module.exports = {
    createUserCart,
    getUserActiveCart,
    modifyCartProductQuantity,
    clearAllCartProducts,
    deleteCartItem,
    getUserActiveWeeklyCart,
    getCoupenDetails,
    cloneOrderToCart
}