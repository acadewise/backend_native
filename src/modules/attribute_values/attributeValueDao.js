const AttributeValue = require("../../models").attribute_values;

/**
 * Get AttributeValue details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return AttributeValue.findOne({
    where: { id },
  });
}

/**
 * Get AttributeValue details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return AttributeValue.findAll(object);
}

/**
 * Find all the AttributeValues
 */
function findAll(offset, limit) {
  return AttributeValue.findAndCountAll({ offset, limit });
}

/**
 * Create AttributeValue.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return AttributeValue.create(data);
}

/**
 * Bulk Create AttributeValue.
 *
 * @param {Object} data
 * @returns {Promise}
 */
 function bulkCreate(data) {
    return AttributeValue.bulkCreate(data, { returning: true });
  }

/**
 * Update AttributeValue.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return AttributeValue.update(data, { where: { id }, returning: true });
}

/**
 * Soft delete AttributeValue.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function softDelete(id) {
  return AttributeValue.destroy({
    where: {
      id,
    },
  });
}

/**
 * Soft delete AttributeValue with conditions.
 *
 * @param {object} condition
 * @returns {Promise}
 */
 function softDeleteWithCondition(condition) {
  return AttributeValue.destroy(condition);
}

module.exports = {
  findById,
  findBy,
  findAll,
  create,
  bulkCreate,
  update,
  softDelete,
  softDeleteWithCondition
};
