const InventoryGeoname = require("../../models").inventory_geoname;
const { Op, Sequelize } = require('sequelize');

/**
 * Get InventoryGeoname details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
    return InventoryGeoname.findOne({
        where: { id },
    });
}

/**
 * Get InventoryGeoname details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
    return InventoryGeoname.findAll(object);
}

/**
 * Find all the Brands
 */
function findAll(offset, limit) {
    return InventoryGeoname.findAll({ offset, limit });
}

/**
 * Create InventoryGeoname.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return InventoryGeoname.create(data);
}

/**
 * Update InventoryGeoname.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return InventoryGeoname.update(data, { where: { id }, returning: true });
}

/**
 * Soft delete InventoryGeoname.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function softDelete(id) {
    return InventoryGeoname.destroy({
        where: {
            id,
        },
    });
}

/**
 * find all inventoryGeoname with attributes and pagination
 * @param {*} attributes 
 * @param {*} offset 
 * @param {*} limit 
 * @returns 
 */
function findAllWithAttributesAndPagination(offset, limit, attributes = []) {
    return InventoryGeoname.findAndCountAll({
        attributes: attributes,
        offset, limit,
        order: [['id', 'DESC']]
    })
}
/**
 * find all inventoryGeoname with attributes and pagination
 * @param {*} attributes 
 * @param {*} offset 
 * @param {*} limit 
 * @returns 
 */
function findWithArrayObject(ziparray = []) {
    
    let stringArr = JSON.parse(ziparray);
   
    return InventoryGeoname.findAll({
        where: {
            id: {
                [Op.in]: stringArr
            }
        }
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
    findWithArrayObject
};
