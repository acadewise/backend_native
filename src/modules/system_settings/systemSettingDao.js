const SystemSettings = require("../../models").system_settings;

/**
 * Get SystemSettings details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return SystemSettings.findOne({
    where: { id },
  });
}

/**
 * Get SystemSettings details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return SystemSettings.findAll(object);
}

/**
 * Find all the SystemSettingss
 */
function findAll(offset, limit) {
  return SystemSettings.findAll({ offset, limit });
}

/**
 * Create SystemSettings.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return SystemSettings.create(data);
}

/**
 * Update SystemSettings.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return SystemSettings.update(data, { where: { id }, returning: true });
}



/**
 * 
 * @param {*} attributes 
 * @param {*} offset 
 * @param {*} limit 
 * @returns 
 */
function findAllWithAttributesAndPagination(attributes, offset, limit) {
  return SystemSettings.findAndCountAll({
    attributes: attributes,
    offset, limit
  })
}



module.exports = {
  findById,
  findBy,
  findAll,
  create,
  update,
  findAllWithAttributesAndPagination

};
