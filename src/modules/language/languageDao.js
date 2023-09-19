const Language = require('../../models').language

/**
 * Get user details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
    return Language.findOne({
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
    return Language.findOne(object);
}

/**
 * Find all the users
 */
function findAll() {
    return Language.findAll();
}

/**
 * Create user.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return Language.create(data);
}

/**
 * Update user.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return Language.update(data, { where: { id } });
}

/**
 * Check unique language code.
 * @param {Number} code
 * @returns {Promise}
 */
function checkUniqueLangCode(code) {
    return Language.findOne({
        where: { code },
        attributes: ['code']
    });
}

module.exports = {
    findById,
    findBy,
    findAll,
    create,
    update,
    checkUniqueLangCode
}
