const UserAddress = require('../../models').user_addresses;

/**
 * Get user details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
    return UserAddress.findOne({
        where: { id }
    });
}

/**
 * Get user details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
    return UserAddress.findOne(object);
}

/**
 * Find all the users
 */
function findAll() {
    return UserAddress.findAll();
}

/**
 * Find all the users
 */
function findAndCountAll(user_id, attributes, page, limit) {
    return UserAddress.findAndCountAll({ where: { user_id }, attributes, page, limit });
}

/**
 * Create user.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return UserAddress.create(data);
}

/**
 * Create user.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function bulkCreate(data) {
    return UserAddress.bulkCreate(data);
}

/**
 * Update user.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return UserAddress.update(data, { where: { id } });
}

/**
 * Update user by user_id.
 *
 * @param {Number} user_id
 * @param {Object} data
 * @returns {Promise}
 */
function updateByUserId(user_id, data) {
    return UserAddress.update(data, { where: { user_id } });
}

/**
 * Soft delete Address.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function softDelete(id) {
    return UserAddress.destroy({ where: { id } });
}

module.exports = {
    findById,
    findBy,
    findAll,
    findAndCountAll,
    create,
    update,
    updateByUserId,
    bulkCreate,
    softDelete
}