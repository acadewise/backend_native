const CouponMaster = require("../../models").coupon_master;

/**
 * Get CouponMaster details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return CouponMaster.findOne({
    where: { id },
  });
}


function findByCoupon_Code(coupon_code) {
  return CouponMaster.findOne({
    where: { coupon_code },
  });
}

/**
 * Get CouponMaster details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return CouponMaster.findAll(object);
}

/**
 * Find all the CouponMasters
 */
function findAll(offset, limit) {
  return CouponMaster.findAll({ offset, limit });
}

/**
 * Create CouponMaster.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return CouponMaster.create(data);
}

/**
 * Update CouponMaster.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return CouponMaster.update(data, { where: { id }, returning: true });
}

/**
 * Soft delete CouponMaster.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function softDelete(id) {
  return CouponMaster.destroy({
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
  return CouponMaster.findAndCountAll({
    attributes: attributes,
    offset, limit, order: [['id', 'DESC']]
  })
}

/**
 * 
 * @param {*} slug 
 */
function checkUniqueCouponMasterSlug(slug) {
  return CouponMaster.findOne({
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
  checkUniqueCouponMasterSlug,
  findByCoupon_Code
};
