const DeliveryPointAddress = require("../../models").delivery_point_address;
const InventoryGeoname = require("../../models").inventory_geoname;
const { Op, Sequelize } = require('sequelize');

/**
 * Get DeliveryPointAddress details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return DeliveryPointAddress.findOne({
    where: { id },
    include: [
      {
        model: InventoryGeoname,
        as: 'pincode_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      }
    ]
  });
}

function checkById(delivery_point_address_id) {
  return DeliveryPointAddress.findOne({
    where: { id:delivery_point_address_id }
  });
}



/**
 * Get DeliveryPointAddress details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return DeliveryPointAddress.findAll(object);
}

/**
 * Find all the DeliveryPointAddresss
 */
function findAll(offset, limit) {
  return DeliveryPointAddress.findAll({ offset, limit });
}

/**
 * Create DeliveryPointAddress.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return DeliveryPointAddress.create(data);
}

/**
 * Update DeliveryPointAddress.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return DeliveryPointAddress.update(data, { where: { id }, returning: true });
}

/**
 * Soft delete DeliveryPointAddress.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function softDelete(id) {
  return DeliveryPointAddress.destroy({
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
  return DeliveryPointAddress.findAndCountAll({
    attributes: attributes,
    offset, limit,
    include: [
      {
        model: InventoryGeoname,
        as: 'pincode_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      }
    ],
    order:[['id','DESC']]
  })
}

/**
 * 
 * @param {*} slug 
 */
function checkUniqueDeliveryPointAddressSlug(slug) {
  return DeliveryPointAddress.findOne({
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
  checkUniqueDeliveryPointAddressSlug,
  checkById,
  
};
