const Brand = require("../../models").brands;

/**
 * Get Brand details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return Brand.findOne({
    where: { id },
  });
}

/**
 * Get Brand details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return Brand.findAll(object);
}

/**
 * Find all the Brands
 */
function findAll(offset, limit) {
  return Brand.findAll({ offset, limit });
}

/**
 * Create Brand.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return Brand.create(data);
}

/**
 * Update Brand.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return Brand.update(data, { where: { id }, returning: true });
}

/**
 * Soft delete Brand.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function softDelete(id) {
  return Brand.destroy({
    where: {
      id,
    },
  });
}

/**
 * find all bands with attributes and pagination
 * @param {*} attributes 
 * @param {*} offset 
 * @param {*} limit 
 * @returns 
 */
function findAllWithAttributesAndPagination(attributes, offset, limit) {
  return Brand.findAndCountAll({
    attributes: attributes,
    offset, limit,
    order:[['id','DESC']]
  })
}

module.exports = {
  findById,
  findBy,
  findAll,
  create,
  update,
  softDelete,
  findAllWithAttributesAndPagination
};
