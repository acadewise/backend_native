const OrderStatus = require("../../../models").order_status_history;

/**
 * Get OrderStatus details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
    return OrderStatus.findOne({
        where: { id },
    });
}

/**
 * Get OrderStatus details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
    return OrderStatus.findAll(object);
}

/**
 * Find all the OrderStatuss
 */
function findAll(offset, limit) {
    return OrderStatus.findAll({ offset, limit });
}

/**
 * Create OrderStatus.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return OrderStatus.create(data);
}

/**
 * Create OrderStatus.
 *
 * @param {Object} data
 * @param {Object} t
 * @returns {Promise}
 */
function createT(data, t) {
    return OrderStatus.create(data, { transaction: t });
}

/**
 * Update OrderStatus.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return OrderStatus.update(data, { where: { id }, returning: true });
}

module.exports = {
    findById,
    findBy,
    findAll,
    create,
    createT,
    update
};
