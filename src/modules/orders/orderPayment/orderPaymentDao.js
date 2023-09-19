const OrderPayment = require("../../../models").order_payment;

/**
 * Get OrderPayment details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
    return OrderPayment.findOne({
        where: { id },
    });
}

/**
 * Get OrderPayment details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
    return OrderPayment.findAll(object);
}

/**
 * Find all the OrderPayments
 */
function findAll(offset, limit) {
    return OrderPayment.findAll({ offset, limit });
}

/**
 * Create OrderPayment.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return OrderPayment.create(data);
}

/**
 * Create OrderPayment.
 *
 * @param {Object} data
 * @param {Object} t
 * @returns {Promise}
 */
function createT(data, t) {
    return OrderPayment.create(data, { transaction: t });
}

/**
 * Update OrderPayment.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return OrderPayment.update(data, { where: { id }, returning: true });
}

/**
 * Update OrderPayment with transaction.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
 function updateT(id, data, t) {
    return OrderPayment.update(data, { where: { id }, transaction: t, returning: true });
}

module.exports = {
    findById,
    findBy,
    findAll,
    create,
    createT,
    update,
    updateT
};
