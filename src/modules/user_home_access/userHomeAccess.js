const UserHomeAccess = require('../../models').User_Home_Access


/**
 * Get user details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
 function findById(id) {
    return UserHomeAccess.findOne({
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
    return UserHomeAccess.findOne(object);
}

/**
 * Find all the users
 */
function findAll() {
    return UserHomeAccess.findAll();
}

/**
 * Create user.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return UserHomeAccess.create(data);
}

/**
 * Update user.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return UserHomeAccess.update(data, { where: { id } });
}

module.exports = {
    findById,
    findBy,
    findAll,
    create,
    update
}