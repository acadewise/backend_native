const cartProduct = require('../../../models').cart_products;

/**
 * 
 * @param {*} data 
 * @param {*} t 
 * @returns 
 */
function createCartProductT(data, t) {
    return cartProduct.create(data, { transaction: t });
}

/**
 * 
 * @param {*} cart_uuid 
 * @param {*} product_id 
 * @param {*} t 
 * @returns 
 */
function getProductByCIDPIDT(cart_uuid, product_id, t) {
    return cartProduct.findOne({
        where: {
            cart_uuid,
            product_id
        },
        transaction: t
    });
}

function getCartProduct(cart_id, id, t) {
    return cartProduct.findOne({
        where: {
            cart_id,
            id
        },
        transaction: t
    });
}

/**
 * Update product.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function updateT(id, data, t) {
    return cartProduct.update(data, { where: { id }, transaction: t, returning: true });
}

/**
 * Update product.
 *
 * @param {*} cart_uuid
 * @param {Object} data
 * @returns {Promise}
 */
function updateByCartUuidT(cart_uuid, data, t) {
    return cartProduct.update(data, { where: { cart_uuid }, transaction: t, returning: true });
}



/**
 * 
 * @param {*} cart_uuid 
 * @param {*} t 
 * @returns 
 */
function getAllCartProductDeliveryType(cart_uuid, t) {
    return cartProduct.findAll({
        where: {
            cart_uuid: cart_uuid,
            is_active: true
        },
        attributes: ['product_delivery_type'],
        transaction: t
    });
}

module.exports = {
    createCartProductT,
    getProductByCIDPIDT,
    updateT,
    updateByCartUuidT,
    getAllCartProductDeliveryType,
    getCartProduct
    
}