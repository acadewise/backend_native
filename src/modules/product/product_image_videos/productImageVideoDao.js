const ProdImgVid = require("../../../models").product_image_videos;

/**
 * Get Product images and videos details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
    return ProdImgVid.findOne({
        where: { id, is_active: true },
    });
}

/**
 * Get any Product images and videos details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findAnyById(id) {
    return ProdImgVid.findOne({
        where: { id },
    });
}

/**
 * Get Product images and videos details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
    return ProdImgVid.findAll(object);
}

/**
 * Find all the ProdIuct images and videos
 */
function findAll(product_id, offset, limit) {
    return ProdImgVid.findAll({
        where: {
            product_id,
            is_active: true
        },
        offset, limit
    });
}

/**
 * Create Product images and videos.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return ProdImgVid.create(data);
}

/**
 * Bulk create Product images and videos.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function bulkCreate(data, t) {
    return ProdImgVid.bulkCreate(data);
}

/**
 * Bulk create Product images and videos with transaction.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function bulkCreateT(data, t) {
    return ProdImgVid.bulkCreate(data, { transaction: t });
}

/**
 * Update Product images and videos.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return ProdImgVid.update(data, { where: { id }, returning: true });
}

/**
 * Update Product images and videos.
 *
 * @param {Number} id
 * @param {Object} data
 * @param {Object} t
 * @returns {Promise}
 */
function updateT(id, data, t) {
    return ProdImgVid.update(data, { where: { id }, transaction: t, returning: true });
}

/**
 * Delete product image.
 * @param {*} id 
 * @returns 
 */
function softDelete(id) {
    return ProdImgVid.destroy({ where: { id } });
}

/**
 * Delete product image with transaction.
 * @param {*} id 
 * @param {*} t
 * @returns 
 */
function softDeleteT(id, t) {
    return ProdImgVid.destroy({ where: { id }, transaction: t });
}

/**
 * Disable all product images by product_id.
 * @param {*} product_id 
 * @returns 
 */
function disablebyProductIdT(product_id, t) {
    const obj = { is_active: false };
    return ProdImgVid.update(obj, { where: { product_id }, transaction: t, returning: true });
}

module.exports = {
    findById,
    findAnyById,
    findBy,
    findAll,
    create,
    bulkCreate,
    bulkCreateT,
    update,
    updateT,
    softDelete,
    softDeleteT,
    disablebyProductIdT
};
