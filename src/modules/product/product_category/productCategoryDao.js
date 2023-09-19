const ProductCategory = require('../../../models').product_category;

/**
 * Bulk Create and map Product Category.
 * @param {*} data 
 * @returns 
 */
function bulkCreateProductCategory(data) {
    return ProductCategory.bulkCreate(data, { returning: true });
}

/**
 * Bulk Create and map Product Category with transaction.
 * @param {*} data 
 * @param {*} t
 * @returns 
 */
function bulkCreatePCT(data, t) {
    return ProductCategory.bulkCreate(data, { transaction: t }, { returning: true });
}

/**
 * Create and map Product Category.
 * @param {*} data 
 * @param {*} t
 * @returns 
 */
function createProductCategory(data, t) {
    return ProductCategory.create(data, { transaction: t });
}

/**
 * get product category.
 * @param {*} product_id
 * @param {*} t 
 * @returns 
 */
function getProductCategory(product_id, t) {
    return ProductCategory.findAll({
        attributes: ['id', 'category_id', 'product_id'],
        where: { product_id }, transaction: t
    });
}

/**
 * get product category by product_id and category_id.
 * @param {*} product_id 
 * @param {*} category_id 
 * @param {*} t
 * @returns 
 */
function getProdCatByPidAndCid(product_id, category_id, t) {
    return ProductCategory.findOne({
        attributes: ['id', 'category_id', 'product_id', 'is_active'],
        where: { product_id, category_id }, transaction: t
    });
}

/**
 * Disable product category.
 * @param {*} product_id 
 * @returns 
 */
function disableProductCategoryT(product_id, t) {
    const update = {
        is_active: false
    };
    return ProductCategory.update(update, { where: { product_id }, transaction: t });
}

/**
 * update product category.
 * @param {*} product_id 
 * @param {*} t
 * @returns 
 */
function updateProductCategory(id, updateObj, t) {
    return ProductCategory.update(updateObj, { where: { id }, transaction: t });
}

/**
 * remove Product Category By Id
 * @param {*} ids 
 * @returns 
 */
function removeProdCatById(ids) {
    return ProductCategory.destroy({ where: { id: ids } });
}

/**
 * get category products using custom object.
 * @param {*} customObj 
 */
function getCategoryProducts(customObj) {
    return ProductCategory.findAndCountAll(customObj);
}

module.exports = {
    bulkCreateProductCategory,
    bulkCreatePCT,
    createProductCategory,
    getProductCategory,
    getProdCatByPidAndCid,
    disableProductCategoryT,
    updateProductCategory,
    removeProdCatById,
    getCategoryProducts
}