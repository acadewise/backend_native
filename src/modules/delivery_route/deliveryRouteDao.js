const { QueryTypes } = require("sequelize");
const { sequelize } = require("../../models");

const DeliveryRoute = require("../../models").delivery_route;
const { Op,Sequelize } = require('sequelize');

/**
 * Get DeliveryRoute details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return DeliveryRoute.findOne({
    where: { id },
  });
}

/**
 * Get DeliveryRoute details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return DeliveryRoute.findAll(object);
}

/**
 * Find all the DeliveryRoutes
 */
function findAll(offset, limit) {
  return DeliveryRoute.findAll({ offset, limit });
}

/**
 * Create DeliveryRoute.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return DeliveryRoute.create(data);
}

/**
 * Update DeliveryRoute.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return DeliveryRoute.update(data, { where: { id }, returning: true });
}

/**
 * Soft delete DeliveryRoute.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function softDelete(id) {
  return DeliveryRoute.destroy({
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
  return DeliveryRoute.findAndCountAll({
    attributes: attributes,
    offset, limit,
    order:[['id','DESC']]
  })
}

/**
 * 
 * @param {*} slug 
 */
function checkUniqueDeliveryRouteSlug(title) {
  return DeliveryRoute.findOne({
    where: { title:Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', '%' + title.toLowerCase() + '%') },
    attributes: ['title']
  });
}

/**
 * 
 * @param {*} zip_code 
 * @returns 
 */
async function getRouteIdsByZip(zip_code) {
  const routes = await sequelize.query(`select b.id from delivery_routes b 
      join inventory_geonames e on e.id = any(string_to_array(b.zip_code,',')::int[]) where e.zip_code = '${zip_code}';`,
    {
      model: DeliveryRoute,
      mapToModel: true,
      raw: true,
      type: QueryTypes.SELECT
    });
  return routes;
}

function checkUniqueRouteAttributeUpdate(type, value, id) {
  return DeliveryRoute.findOne({
      where: {
          [type]: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col(type)), 'LIKE', '%' + value.toLowerCase() + '%'),
          id: { [Op.ne]: id }
      },
      attributes: [type]
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
  checkUniqueDeliveryRouteSlug,
  getRouteIdsByZip,
  checkUniqueRouteAttributeUpdate
};
