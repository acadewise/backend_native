const OrderAddress = require("../../../models").order_address;

/**
 * Get OrderAddress details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
    return OrderAddress.findOne({
        where: { id },
    });
}

/**
 * Get OrderAddress details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
    return OrderAddress.findAll(object);
}

/**
 * Find all the OrderAddresss
 */
function findAll(offset, limit) {
    return OrderAddress.findAll({ offset, limit });
}

/**
 * Create OrderAddress.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data, t) {
    return OrderAddress.create(data, { transaction: t });
}

/**
 * Update OrderAddress.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return OrderAddress.update(data, { where: { id }, returning: true });
}

/**
 * Update OrderAddress by order Id with transaction.
 *
 * @param {Number} order_id
 * @param {Object} data
 * @returns {Promise}
 */
function updateByOrderIdT(order_id, data, t) {
    return OrderAddress.update(data, { where: { order_id }, returning: true, transaction: t });
}

module.exports = {
    findById,
    findBy,
    findAll,
    create,
    update,
    updateByOrderIdT
};
