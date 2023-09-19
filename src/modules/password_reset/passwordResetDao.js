const PasswordReset = require('../../models').password_resets

/**
 * Get user details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
 function findById(id) {
    return PasswordReset.findOne({
        where: { id }
    });
}

/**
 * Get user details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
 function findOne(object) {
    return PasswordReset.findOne({
        where: object
    });
}


/**
 * Get user details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
    return PasswordReset.findOne(object);
}

/**
 * Find all the users
 */
function findAll() {
    return PasswordReset.findAll();
}

/**
 * Create user.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return PasswordReset.create(data);
}

/**
 * Update user.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return PasswordReset.update(data, { where: { id } });
}

/**
 * It delete the record permanantely by id
 * @method hardDeleteById
 * @param {*} id 
 * @returns 
 */
function hardDeleteById(id) {
    return PasswordReset.destroy({
        where: {
            id
        },
        force: true
    })
}

module.exports = {
    findById,
    findOne,
    findBy,
    findAll,
    create,
    update,
    hardDeleteById
}