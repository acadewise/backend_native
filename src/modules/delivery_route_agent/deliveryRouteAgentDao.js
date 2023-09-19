const DeliveryRouteAgent = require("../../models").delivery_route_agent;
const Admin = require("../../models").admins;
const DeliveryRoute = require("../../models").delivery_route;
const { Op } = require('sequelize');

/**
 * Get DeliveryRouteAgent details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return DeliveryRouteAgent.findOne({
    where: { id },
  });
}

/**
 * Get Bulk Create
 *
 * @param {Number} id
 * @returns {Promise}
 */
function bulkCreate(data) {
  return DeliveryRouteAgent.bulkCreate(data, { returning: true });
}

/**
 * Get DeliveryRouteAgent details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return DeliveryRouteAgent.findAll(object);
}

/**
 * Find all the DeliveryRouteAgents
 */
function findAll(offset, limit) {
  return DeliveryRouteAgent.findAll({ offset, limit });
}

/**
 * Create DeliveryRouteAgent.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return DeliveryRouteAgent.create(data);
}

/**
 * Update DeliveryRouteAgent.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return DeliveryRouteAgent.update(data, { where: { id }, returning: true });
}

/**
 * Soft delete DeliveryRouteAgent.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function softDelete(id) {
  return DeliveryRouteAgent.destroy({
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
function findAllWithAttributesAndPagination(query, offset, limit) {
 
  return DeliveryRouteAgent.findAndCountAll({
    subQuery: false,
    distinct: true,
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    include: [
      {
        model: Admin,
        as: 'agent_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'created_by', 'updated_by', 'deleted_by', 'password'] },
        where: { is_active: true }

      },
      {
        model: DeliveryRoute,
        as: 'route_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'created_by', 'updated_by', 'deleted_by', 'password'] },
       // where: { is_active: true }

      }
    ],
    where: {
      route_id: {
        [Op.in]: JSON.parse(query.route_ids)
      }
    },

  })
}

/**
 * 
 * @param {*} slug 
 */
function checkUniqueDeliveryRouteAgentSlug(slug) {
  return DeliveryRouteAgent.findOne({
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
  checkUniqueDeliveryRouteAgentSlug,
  bulkCreate
};
