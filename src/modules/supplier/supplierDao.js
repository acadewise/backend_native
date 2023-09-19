const Supplier = require("../../models").supplier;

/**
 * Get Supplier details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return Supplier.findOne({
    where: { id },
  });
}

/**
 * Get Supplier details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return Supplier.findAll(object);
}

/**
 * Find all the Suppliers
 */
function findAll(offset, limit) {
  return Supplier.findAll({ offset, limit });
}

/**
 * Create Supplier.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return Supplier.create(data);
}

/**
 * Update Supplier.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return Supplier.update(data, { where: { id }, returning: true });
}

/**
 * Soft delete Supplier.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function softDelete(id) {
  return Supplier.destroy({
    where: {
      id,
    },
  });
}

/**
 * 
 * @param {*} attributes 
 * @param {*} offset 
 * @param {*} limit 
 * @returns 
 */
function findAllWithAttributesAndPagination(attributes, offset, limit) {
  return Supplier.findAndCountAll({
    attributes: attributes,
    offset, limit,
    order:[['id','DESC']]
  })
}

/**
 * 
 * @param {*} slug 
 */
function checkUniqueSupplierSlug(slug) {
  return Supplier.findOne({
    where: { slug },
    attributes: ['slug']
  });
}

module.exports = {
  findById,
  findBy,
  findAll,
  create,
  update,
  softDelete,
  findAllWithAttributesAndPagination,
  checkUniqueSupplierSlug
};
