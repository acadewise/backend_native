const ProdAttrValue = require('../../../models').product_attribute_values;

/**
 * Bulk Create Attribute Categories.
 * @param {*} data 
 * @param {*} t
 * @returns 
 */
function bulkCreateProdAttrValue(data, t) {
    return ProdAttrValue.bulkCreate(data, { transaction: t }, { returning: true });
}

/**
 * Bulk Create Attribute Categories with Transaction.
 * @param {*} data
 * @param {*} t 
 * @returns 
 */
function bulkCreatePAVT(data, t) {
    return ProdAttrValue.bulkCreate(data, { transaction: t }, { returning: true });
}

/**
 * Create Attribute Categories.
 * @param {*} data 
 * @param {*} t
 * @returns 
 */
function createProdAttrValue(data, t) {
    return ProdAttrValue.create(data, { transaction: t });
}

/**
 * Get Attribute And values.
 * @param {*} product_id
 * @param {*} attribute_id
 * @returns 
 */
function getProdAttrValue(product_id, attribute_id) {
    return ProdAttrValue.findAll({ where: { product_id, attribute_id } });
}

/**
 * Get Attribute values by product_id, attribute_id and attribute_value_id.
 * @param {*} product_id
 * @param {*} attribute_id
 * @returns 
 */
function getProdAttrValByPidAndAidAndAvid(product_id, attribute_id, attribute_value_id) {
    return ProdAttrValue.findOne({
        where: { product_id, attribute_id, attribute_value_id },
        attributes: ['id', 'product_id', 'attribute_id', 'attribute_value_id', 'is_active']
    });
}

/**
 * update product attribute values.
 * @param {*} id 
 * @param {*} t
 * @returns 
 */
function updateProdAttrValue(id, updateObj, t) {
    return ProdAttrValue.update(updateObj, { where: { id }, transaction: t });
}

/**
 * update product attribute values.
 * @param {*} product_id 
 * @param {*} attribute_ids
 * @param {*} t
 * @returns 
 */
function updateProdAttrValueByPIDAID(product_id, attribute_ids, updateObj, t) {
    return ProdAttrValue.update(updateObj, { where: { product_id, attribute_id: attribute_ids }, transaction: t });
}

/**
 * update product attribute values.
 * @param {*} product_id 
 * @param {*} attribute_id 
 * @param {*} attribute_value_ids
 * @param {*} t
 * @returns 
 */
function updateProdAttrValueByPIDAIDAVID(product_id, attribute_id, attribute_value_ids, updateObj, t) {
    return ProdAttrValue.update(updateObj, {
        where: {
            product_id, attribute_id, attribute_value_id: attribute_value_ids
        },
        transaction: t
    });
}

/**
 * Remove Multiple Attribute Category.
 * @param {*} ids
 * @returns
 */
function removeProdAttrValue(ids) {
    return ProdAttrValue.destroy({
        where: {
            id: ids
        }
    });
}

/**
 * Disable product attribute values.
 * @param {*} product_id 
 * @returns 
 */
function disableProductAttributeValuesT(product_id, t) {
    const update = {
        is_active: false
    };
    return ProdAttrValue.update(update, { where: { product_id }, transaction: t });
}

/**
 * Delete attribute values by product_id, attribute_id.
 * @param {*} product_id 
 * @param {*} attribute_id 
 * @param {*} ids 
 * @returns 
 */
function deleteAttributeValuesByPandAId(product_id, attribute_id, ids) {
    return ProdAttrValue.destroy({
        where: {
            product_id,
            attribute_id,
            attribute_value_id: ids
        }
    });
}

module.exports = {
    bulkCreateProdAttrValue,
    bulkCreatePAVT,
    createProdAttrValue,
    getProdAttrValue,
    getProdAttrValByPidAndAidAndAvid,
    updateProdAttrValue,
    updateProdAttrValueByPIDAID,
    updateProdAttrValueByPIDAIDAVID,
    removeProdAttrValue,
    disableProductAttributeValuesT,
    deleteAttributeValuesByPandAId
}