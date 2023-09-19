const ActivityLog = require('../../models').activity_logs

/**
 * Get user details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
 function findById(id) {
    return ActivityLog.findOne({
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
    return ActivityLog.findOne(object);
}

/**
 * Find all the users
 */
function findAll() {
    return ActivityLog.findAll();
}

/**
 * Create user.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return ActivityLog.create(data);
}

/**
 * Update user.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return ActivityLog.update(data, { where: { id } });
}

module.exports = {
    findById,
    findBy,
    findAll,
    create,
    update
}