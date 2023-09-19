const { Op } = require('sequelize');
const { sequelize } = require('../../../models');
const userCart = require('../../../models').user_carts;
const productModel = require('../../../models').products;
const cartProduct = require('../../../models').cart_products;
const productImage = require('../../../models').product_image_videos;

/**
 * Create cart using transaction.
 * @param {*} data 
 * @param {*} t 
 * @returns 
 */
function createUserCartT(data, t) {
    return userCart.create(data, { transaction: t });
}

/**
 * 
 * @param {*} customer_id 
 * @param {*} cart_status 
 * @param {*} t
 * @returns 
 */
function getCartByCIdCtId(customer_id, cart_status) {
    return userCart.findOne({
        where: {
            customer_id,
            cart_status,
            created_by:{ [Op.is]: null }
        },
        include: [
            {
                model: cartProduct,
                as: 'user_cart_products',
                where: { is_active: true },
                required: false,
                include: [{
                    model: productModel,
                    as: 'cart_product_detail',
                    attributes: ['id', 'name', 'sku', 'description', 'max_retail_price', 'special_sale_price', 'is_on_sale','min_buy_quantity','max_buy_quantity'],
                    where: {
                        is_active: true
                    },
                    required: false,
                    include: [{
                        model: productImage,
                        as: 'product_images',
                        attributes: ['id', 'product_id', 'url', 'position'],
                        required: false
                        // add pin-code filter.
                    }]
                }]
            }
        ]
    });
}


function getWeeklyCartByCIdCtId(customer_id, cart_status) {
    return userCart.findOne({
        where: {
            customer_id,
            cart_status,
            created_by:{ [Op.is]: null },
            is_weekly_planner:true
        },
        include: [
            {
                model: cartProduct,
                as: 'user_cart_products',
                where: { is_active: true },
                required: false,
                include: [{
                    model: productModel,
                    as: 'cart_product_detail',
                    attributes: ['id', 'name', 'sku', 'description', 'max_retail_price', 'special_sale_price', 'is_on_sale','min_buy_quantity','max_buy_quantity'],
                    where: {
                        is_active: true
                    },
                    required: false,
                    include: [{
                        model: productImage,
                        as: 'product_images',
                        attributes: ['id', 'product_id', 'url', 'position'],
                        required: false
                        // add pin-code filter.
                    }]
                }]
            }
        ]
    });
}

/**
 * 
 * @param {*} customer_id 
 * @param {*} cart_status 
 * @param {*} t
 * @returns 
 */
function getCartByCIdCtIdT(customer_id, cart_status, t) {
    return userCart.findOne({
        where: {
            customer_id,
            cart_status,
            created_by:{ [Op.is]: null }
        },
        include: [
            {
                model: cartProduct,
                as: 'user_cart_products',
                where: { is_active: true },
                required: false,
                include: [{
                    model: productModel,
                    as: 'cart_product_detail',
                    attributes: { exclude: ['created_by', 'updated_by', 'deleted_by', 'createdAt', 'updatedAt', 'deletedAt'] },
                    where: {
                        is_active: true
                    },
                    required: false,
                    include: [{
                        model: productImage,
                        as: 'product_images',
                        attributes: ['id', 'product_id', 'url', 'position'],
                        required: false,
                        // where: {
                        //     position: 1
                        // }
                        // add pin-code filter.
                    }]
                }]
            }
        ],
        transaction: t
    });
}

/**
 * 
 * @param {*} customer_id 
 * @param {*} cart_status 
 * @param {*} t 
 * @returns 
 */
function getUserActiveCartT(customer_id, cart_status, t) {
    return userCart.findOne({
        where: {
            customer_id,
            cart_status,
            created_by:{ [Op.is]: null }
        },
        include: [
            {
                model: cartProduct,
                as: 'user_cart_products',
                where: { is_active: true },
                required: false
            }
        ],
        transaction: t
    });
}

/**
 * 
 * @param {*} id 
 * @param {*} data 
 * @param {*} t 
 * @returns 
 */
function updateT(id, data, t) {
    return userCart.update(data, { where: { id }, transaction: t, returning: true });
}

/**
 * 
 * @param {*} Obj 
 * @returns 
 */
function getCartByObj(Obj) {
    return userCart.findOne(Obj);
}

module.exports = {
    createUserCartT,
    getCartByCIdCtId,
    getCartByCIdCtIdT,
    getUserActiveCartT,
    updateT,
    getCartByObj,
    getWeeklyCartByCIdCtId
};