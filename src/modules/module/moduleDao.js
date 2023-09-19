const Module = require("../../models").modules;

/**
 * Get Module details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return Module.findOne({
    where: { id },
  });
}

/**
 * Get Module details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return Module.findAll(object);
}

/**
 * Find all the Modules
 */
function findAll(offset, limit) {
  return Module.findAll({ offset, limit });
}

/**
 * Find all the Modules with count.
 */
 function findAndCountAll(offset, limit) {
  return Module.findAndCountAll({ offset, limit });
}

/**
 * Create Module.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return Module.create(data);
}

/**
 * Update Module.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return Module.update(data, { where: { id }, returning: true });
}

/**
 * Soft delete Module.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function softDelete(id) {
  return Module.destroy({
    where: {
      id,
    },
  });
}

module.exports = {
  findById,
  findBy,
  findAll,
  findAndCountAll,
  create,
  update,
  softDelete,
};
