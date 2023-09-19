const Role = require('../../models').Roles
const Admin  = require('../../models').admins

/**
 * Get user details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
 function findById(id) {
    return Role.findOne({
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
    return Role.findOne(object);
}

/**
 * Find all the users
 */
function findAll() {
    return Role.findAll();
}

/**
 * Create user.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return Role.create(data);
}

/**
 * Update user.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return Role.update(data, { where: { id } });
}

function getRoleWithAdmins() {
    return Role.findAll({
        where : {
            name: 'admin'
        },
        inlcude:[ {
            model: Admin,
            require: true
        }]
    })
}

module.exports = {
    findById,
    findBy,
    findAll,
    create,
    update,
    getRoleWithAdmins
}