const User = require('../../models').users;
const UserUnAvailability = require('../../models').user_unavailability;
const { Op, Sequelize } = require('sequelize');
const userAddress = require('../../models').user_addresses;
const Language = require('../../models').language;
const OrderModel = require('../../models').orders;


/**
 * Get user details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
    return UserUnAvailability.findOne({
        where: { id },
    });
}

/**
 * Get UserUnAvailability details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
    return UserUnAvailability.findAll(object);
}

/**
 * Find all the UserUnAvailabilitys
 */
function findAll() {
    return UserUnAvailability.findAll();
}

/**
 * Create UserUnAvailability.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return UserUnAvailability.create(data);
}

function bulkCreate(data) {
    return UserUnAvailability.bulkCreate(data);
  }

/**
 * Update UserUnAvailability.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return UserUnAvailability.update(data, { where: { id }, returning: true });
}

function softDelete(id) {
    return UserUnAvailability.destroy({
      where: {
        id,
      },
    });
  }

  function findAllWithAttributesAndPagination(attributes,customer_id, offset, limit) {
    return UserUnAvailability.findAndCountAll({
      attributes: attributes,
      offset, limit,
      where: {
        customer_id:customer_id,
      },
      order:[['id','DESC']]
    })
  }




module.exports = {
    findById,
    findBy,
    findAll,
    create,
    update,
    bulkCreate,
    softDelete,
    findAllWithAttributesAndPagination
    
}