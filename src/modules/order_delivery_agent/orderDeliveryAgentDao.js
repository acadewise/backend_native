const DeliveryRouteAgent = require("../../models").order_delivery_agent;
const {Op}= require('sequelize');

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
 * Get DeliveryRouteAgent details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return DeliveryRouteAgent.findAll(object);
}

function checkAlreadyExits(orderId, deliveryAgentId) {
  return DeliveryRouteAgent.findOne({
    where: {
      [Op.and]: {
        order_id: orderId,
        delivery_agent_id: deliveryAgentId
      }

    }
  });
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
function findAllWithAttributesAndPagination(attributes, offset, limit) {
  return DeliveryRouteAgent.findAndCountAll({
    attributes: attributes,
    offset, limit
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
  checkAlreadyExits
};
