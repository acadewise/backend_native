const ProductTag = require('../../models').tags

/**
 * Get user details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
    return ProductTag.findOne({
        where: { id },
    });
}

/**
 * Get user details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
    return ProductTag.findAll(object);
}

/**
 * Find all the users
 */
function findAll() {
    return ProductTag.findAll();
}

/**
 * Create user.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return ProductTag.create(data);
}

/**
 * Update user.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return ProductTag.update(data, { where: { id }, returning: true });
}


function findAllWithAttributes(attributes) {
 return ProductTag.findAll({
    attributes: attributes
 })
}

function findAllWithAttributesAndPagination(attributes, offset, limit) {
    return ProductTag.findAndCountAll({
       attributes: attributes,
       offset, limit,
       order:[['id','DESC']]
    })
}


function findOneWithAttributes(object, attributes) {
    return ProductTag.findOne({
        where: object,
        attributes: attributes
    });
}

function softDelete(id) {
    return ProductTag.destroy({
        where: {
            id
        }
    })
}

module.exports = {
    findById,
    findBy,
    findAll,
    create,
    update,
    findAllWithAttributes,
    findOneWithAttributes,
    findAllWithAttributesAndPagination,
    softDelete
}