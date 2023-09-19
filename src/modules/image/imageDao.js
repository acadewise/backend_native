const Image = require("../../models").images;

/**
 * Get Image details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return Image.findOne({
    where: { id },
  });
}

/**
 * Get Image details by url
 *
 * @param {String} url
 * @returns {Promise}
 */
function findByUrl(url) {
  return Image.findOne({
    where: { url },
  });
}

/**
 * Get Image details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return Image.findAll(object);
}

/**
 * Find all the Images
 */
function findAll(offset, limit) {
  return Image.findAll({ offset, limit });
}

/**
 * Create Image.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return Image.create(data);
}

/**
 * Bulk Create Image.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function bulkCreate(data) {
  return Image.bulkCreate(data);
}

/**
 * Update Image.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return Image.update(data, { where: { id }, returning: true });
}

/**
 * Soft delete Image.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function hardDelete(id) {
  return Image.destroy({ where: { id } });
}

/**
 * Soft delete Image.
 *
 * @param {Number} id
 * @param {Object} t
 * @returns {Promise}
 */
function hardDeleteT(id, t) {
  return Image.destroy({ where: { id }, transaction: t });
}

module.exports = {
  findById,
  findByUrl,
  findBy,
  findAll,
  create,
  bulkCreate,
  update,
  hardDelete,
  hardDeleteT
};
