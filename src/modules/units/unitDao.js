const Unit = require("../../models").units;
const { Op,Sequelize } = require('sequelize');

/**
 * Get Unit details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return Unit.findOne({
    where: { id },
  });
}

/**
 * Get Unit details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return Unit.findAll(object);
}

/**
 * Find all the Units
 */
function findAll(offset, limit) {
  return Unit.findAll({ offset, limit });
}

/**
 * Create Unit.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return Unit.create(data);
}

/**
 * Update Unit.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return Unit.update(data, { where: { id }, returning: true });
}

/**
 * Soft delete Unit.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function softDelete(id) {
  return Unit.destroy({
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
  return Unit.findAndCountAll({
    attributes: attributes,
    offset, limit,
    order:[['id','DESC']]
  })
}

/**
 * 
 * @param {*} slug 
 */
function checkUniqueUnitSlug(slug) {
  return Unit.findOne({
    where: { slug },
    attributes: ['slug']
  });
}
function checkUniqueUnitName(name) {
  return Unit.findOne({
    where: { name:Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', '%' + name.toLowerCase() + '%') },
    attributes: ['name']
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
  checkUniqueUnitSlug,
  checkUniqueUnitName
};
