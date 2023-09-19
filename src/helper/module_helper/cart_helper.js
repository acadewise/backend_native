const _ = require('lodash');
const moment = require('moment');
const { getProductInventory } = require('./product_utility');
const { validateRouteAgainstProduct } = require('../helper_function');
const userCartDao = require('../../modules/cart/user_cart/userCartDao');
const { findDeliveryRoute } = require('../../modules/product/product/productDao');
const cartProductDao = require('../../modules/cart/cart_product/cartProductDao');
const { DELIVERY_TYPE, CART_TYPE, STOCK_STATUS } = require('../../config/configuration_constant');
const productDao = require('../../modules/product/product/productDao');
const inventoryDao = require("./../../modules/inventory/inventoryDao");


/**
 * 
 * @param {*} cart_detail 
 * @param {*} item
 * @param {*} t 
 * @returns 
 */
const insertCartProduct = async (cart_detail, item, t) => {
    try {
        const addProduct = [];
        const existCartProduct = await cartProductDao.getProductByCIDPIDT(cart_detail.cart_uuid, item.product_id, t);
        if (existCartProduct) {
            let upObj = {
                product_delivery_type: item.product_delivery_type || existCartProduct.product_delivery_type,
                product_variation_type: item.product_variation_type || existCartProduct.product_variation_type,
                product_variation_value: item.product_variation_value || existCartProduct.product_variation_value,
                product_coupon_code: item.product_coupon_code || existCartProduct.product_coupon_code,
                expected_delivery_date: item.expected_delivery_date ? moment(item.expected_delivery_date, 'YYYY-MM-DD h:m:s') : existCartProduct.expected_delivery_date,
                expected_delivery_time: item.expected_delivery_time || existCartProduct.expected_delivery_time,
                delivery_start_date: item.delivery_start_date ? moment(item.delivery_start_date, 'YYYY-MM-DD h:m:s') : existCartProduct.delivery_start_date,
                delivery_end_date: item.delivery_end_date ? moment(item.delivery_end_date, 'YYYY-MM-DD h:m:s') : existCartProduct.delivery_end_date,
                delivery_time_slot: item.delivery_time_slot || existCartProduct.delivery_time_slot,
                auto_renew_subscription: item.auto_renew_subscription,
                milk_delivery_type: item.milk_delivery_type || existCartProduct.milk_delivery_type,
                milk_delivery_slot: item.milk_delivery_slot || existCartProduct.milk_delivery_slot,
                additional_rule_json: item.additional_rule_json ? JSON.stringify(item.additional_rule_json) : existCartProduct.additional_rule_json,
                custom_delivery_dates: item.custom_delivery_dates || existCartProduct.custom_delivery_dates
            };
            if (existCartProduct.is_active === false) {
                upObj.quantity = Number(item.quantity);
                upObj.is_active = true;
            } else {
                upObj.quantity = Number(existCartProduct.quantity) + Number(item.quantity);
            }
            const [count, update] = await cartProductDao.updateT(existCartProduct.id, upObj, t);
            addProduct.push(update);
        } else {
            const addToCart = {
                cart_id: cart_detail.id,
                cart_uuid: cart_detail.cart_uuid,
                product_id: item.product_id,
                quantity: Number(item.quantity),
                product_delivery_type: item.product_delivery_type,
                product_variation_type: item.product_variation_type || null,
                product_variation_value: item.product_variation_value || null,
                product_coupon_code: item.product_coupon_code || null,
                expected_delivery_date: item.expected_delivery_date ? moment(item.expected_delivery_date, 'YYYY-MM-DD h:m:s') : null,
                expected_delivery_time: item.expected_delivery_time || null,
                delivery_start_date: item.delivery_start_date ? moment(item.delivery_start_date, 'YYYY-MM-DD h:m:s') : null,
                delivery_end_date: item.delivery_end_date ? moment(item.delivery_end_date, 'YYYY-MM-DD h:m:s') : null,
                delivery_time_slot: item.delivery_time_slot || null,
                auto_renew_subscription: item.auto_renew_subscription,
                milk_delivery_type: item.milk_delivery_type || null,
                milk_delivery_slot: item.milk_delivery_slot || null,
                additional_rule_json: item.additional_rule_json ? JSON.stringify(item.additional_rule_json) : null,
                custom_delivery_dates: item.custom_delivery_dates || null
            }
            const addCartRes = await cartProductDao.createCartProductT(addToCart, t);
            addProduct.push(addCartRes);
        }
        return addProduct;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}

/**
 * 
 * @param {*} cart_uuid 
 * @param {*} productData 
 * @param {*} t 
 * @returns 
 */
const modifyCartProduct = async (cart_uuid, productData, t) => {
    try {
        let res, upObj;
        const existCartProduct = await cartProductDao.getProductByCIDPIDT(cart_uuid, productData.product_id, t);

        if (productData.is_active === false || productData.quantity === 0) {
            upObj = {
                is_active: productData.is_active || false
            }
        } else {
            upObj = {
                quantity: productData.quantity && productData.quantity || existCartProduct.quantity,
                is_active: true,
                product_delivery_type: productData.product_delivery_type,
                product_variation_type: productData.product_variation_type || null,
                product_variation_value: productData.product_variation_value || null,
                product_coupon_code: productData.product_coupon_code || null,
                expected_delivery_date: !_.isEmpty(productData.expected_delivery_date) ? moment(productData.expected_delivery_date, 'YYYY-MM-DD h:m:s') : null,
                expected_delivery_time: productData.expected_delivery_time || null,
                delivery_start_date: !_.isEmpty(productData.delivery_start_date) ? moment(productData.delivery_start_date, 'YYYY-MM-DD h:m:s') : null,
                delivery_end_date: !_.isEmpty(productData.delivery_end_date) ? moment(productData.delivery_end_date, 'YYYY-MM-DD h:m:s') : null,
                delivery_time_slot: productData.delivery_time_slot || null,
                auto_renew_subscription: productData.auto_renew_subscription,
                milk_delivery_type: productData.milk_delivery_type || null,
                milk_delivery_slot: productData.milk_delivery_slot || null,
                additional_rule_json: productData.additional_rule_json ? JSON.stringify(productData.additional_rule_json) : null,
                custom_delivery_dates: productData.custom_delivery_dates || existCartProduct.custom_delivery_dates
            }
        }

        if (existCartProduct) {
            const [count, update] = await cartProductDao.updateT(existCartProduct.id, upObj, t);
            res = update;
        }
        return res;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}

/**
 * 
 * @param {*} activeCart 
 * @param {*} cartItems
 * @returns 
 */
const checkCartProductAndStatus = async (cart_uuid, cartItems, t) => {
    try {
        const itemStatus = cartItems.product_delivery_type;
        const deliveryType = getCartDeliveryType(itemStatus);
        let resStatus = deliveryType;
        const cartAllStatus = await cartProductDao.getAllCartProductDeliveryType(cart_uuid, t);
        if (!_.isEmpty(cartAllStatus) && cartAllStatus.length > 1) {
            const firstStatus = cartAllStatus[0].product_delivery_type;
            const checkStatus = cartAllStatus.every(x => {
                return x.product_delivery_type === firstStatus;
            });
            if (checkStatus) {
                resStatus = deliveryType;
            } else {
                resStatus = CART_TYPE[2];
            }
        }
        return resStatus;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}

/**
 * 
 * @param {*} cartId 
 * @param {*} checkoutData 
 * @param {*} t 
 * @returns 
 */
const setCartDataForCheckout = async (cartId, checkoutData, t) => {
    try {
        const upObj = {
            shipping_pin_code: checkoutData.shipping_pin_code,
            shipping_address_id: checkoutData.shipping_address_id,
            billing_address_id: checkoutData.billing_address_id,
            coupon_code: checkoutData.coupon_code || null
        }
        const [count, update] = await userCartDao.updateT(cartId, upObj, t);
        return update;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}

/**
 * 
 * @param {*} cart_uuid 
 * @param {*} cart_status 
 * @param {*} t 
 * @returns 
 */
const updateCartStatus = async (cart_uuid, cart_status, t) => {
    try {
        const Obj = {
            where: {
                cart_uuid
            },
            transaction: t
        }
        const cartDetail = await userCartDao.getCartByObj(Obj);
        if (cartDetail) {
            const upObj = {
                cart_status
            }
            const [count, update] = await userCartDao.updateT(cartDetail.id, upObj, t);
            return update;
        } else {
            throw new Error('Cart details not found!');
        }
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}

const validateCartItem = async (product_id, zip_code, cartItems, orderItem) => {
    try {
        const error = [];
        const productDetails = await findDeliveryRoute(product_id);

        if (productDetails) {
            const deliveryRouteIds = productDetails.delivery_route_ids;
            if (!_.isEmpty(deliveryRouteIds)) {
                const dIds = deliveryRouteIds.split(',');
                 const zipCodeStatus = await validateRouteAgainstProduct(zip_code, dIds);
                console.log("===>zipCodeStatus", zipCodeStatus)
                if (!zipCodeStatus) {
                    error.push({
                        error: `Product is not deliverable at your location!`
                    });
                }
            }
        } else {
            error.push({
                error: `Product is no longer available! Please try after some time.`
            });
        }
        if (error.length) {
            return error;
        }
        if (!orderItem) {
            orderItem = productDetails;
        }
        const stockStatus = await getProductInventory(product_id, cartItems, orderItem);
        console.log("stockStatus",stockStatus,cartItems,orderItem,product_id)
        if (stockStatus.stock_status === STOCK_STATUS[0] || parseInt(stockStatus.remaining_stock) < parseInt(cartItems.quantity)) {
            error.push({
                error: `Product don't have sufficient stock! Please try after some time.`
            });
        }
       
        return error;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}

const setQuantityForVariableProduct = async (item_detail, t) => {
    let inventory_type = "PREDICTION";

    var startDate = moment(item_detail.delivery_start_date);
    var endDate = moment(item_detail.delivery_end_date);

    var now = startDate.clone(), inventoryDataArr = [];
    while (now.isSameOrBefore(endDate)) {
        let inventoryData = {
            product_id: item_detail.ordered_item_id,
            "inventory_type": inventory_type,
            effective_date: now.format('YYYY-MM-DD'),
            quantity: item_detail.quantity
        };
        let checkQuantity = inventoryDao.setProductQuantity(inventoryData, t);
        now.add(1, 'days');
    };

    return true;


}

const setQuantityForFixedProduct = (item_detail, t) => {
    let inventoryData = {
        product_id: item_detail.ordered_item_id,
        quantity: item_detail.quantity
    };
    let checkQuantity = productDao.setProductQuantity(inventoryData, t);

    return checkQuantity;
}

const getCartDeliveryType = (type) => {
    let resp = "MIXED";
    switch(type){
        case 'daily':
            resp = "SUBSCRIPTION";
            break;
        case 'one-time':
            resp = "ONE_TIME_ORDERS";
            break;
        case 'custom':
            resp = "CUSTOM"
            break;
        default:
            break;
    }
    return resp;
}

module.exports = {
    insertCartProduct,
    modifyCartProduct,
    checkCartProductAndStatus,
    setCartDataForCheckout,
    updateCartStatus,
    validateCartItem,
    setQuantityForVariableProduct,
    setQuantityForFixedProduct,
    getCartDeliveryType
}