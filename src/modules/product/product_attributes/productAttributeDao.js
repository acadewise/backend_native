const productAttribute = require('../../../models').product_attributes;
const ProdAttributeValue = require('../../../models').product_attribute_values;

/**
 * Bulk Create Product Attributes.
 * @param {*} data 
 * @returns 
 */
function bulkCreateProductAttributes(data) {
    return productAttribute.bulkCreate(data, { returning: true });
}

/**
 * Bulk Create Product Attributes with Transaction.
 * @param {*} data 
 * @param {*} t
 * @returns 
 */
function bulkCreatePAT(data, t) {
    return productAttribute.bulkCreate(data, { transaction: t }, { returning: true });
}

/**
 * Create Product Attributes.
 * @param {*} data 
 * @param {*} t
 * @returns 
 */
function createProductAttributes(data, t) {
    return productAttribute.create(data, { transaction: t });
}

/**
 * Get Product Attribute.
 * @param {*} product_id
 * @param {*} attribute_id
 *  @param {*} t
 * @returns 
 */
function getProdAttribute(product_id, attributeIds, t) {
    return productAttribute.findAll({
        attributes: ['id', 'product_id', 'attribute_id'],
        where: {
            product_id,
            attribute_id: attributeIds
        },
        transaction: t
    });
}

/**
 * Get Product Attribute And values.
 * @param {*} product_id
 * @returns 
 */
function getProdAttributeAndValues(product_id) {
    return productAttribute.findAll({
        attributes: ['id', 'product_id', 'attribute_id'],
        where: {
            product_id
        },
        include: [
            {
                model: ProdAttributeValue,
                as: 'prod_attr_values',
                required: true,
                where: { product_id }
            }
        ]
    });
}

/**
 * Get Product Attribute And values.
 * @param {*} id
 * @param {*} t
 * @returns 
 */
function getProdAttAndValById(id, t) {
    return productAttribute.findOne({
        attributes: ['id', 'product_id', 'attribute_id'],
        where: {
            id
        },
        include: [
            {
                model: ProdAttributeValue,
                as: 'prod_attr_values',
                attributes: ['id', 'product_id', 'attribute_id', 'attribute_value_id', 'is_active'],
                where: { is_active: true },
                required: true
            }
        ],
        transaction: t
    });
}

/**
 * 
 * @param {*} product_id 
 * @param {*} attribute_id 
 * @param {*} t 
 * @returns 
 */
function getProdAttributeByPIDAID(product_id, attribute_id, t) {
    return productAttribute.findOne({
        attributes: ['id', 'product_id', 'attribute_id'],
        where: {
            product_id,
            attribute_id
        },
        include: [
            {
                model: ProdAttributeValue,
                as: 'prod_attr_values',
                attributes: ['id', 'product_id', 'attribute_id', 'attribute_value_id', 'is_active'],
                where: { product_id, attribute_id }
            }
        ],
        transaction: t
    });
}

/**
 * Update product attributes.
 * @param {*} id 
 * @param {*} update
 * @param {*} t
 * @returns 
 */
function updateProdAttribute(id, update, t) {
    return productAttribute.update(update, { where: { id }, transaction: t });
}

/**
 * Disable product attributes.
 * @param {*} product_id 
 * @returns 
 */
function disableProductAttributesT(product_id, t) {
    const update = {
        is_active: false
    };
    return productAttribute.update(update, { where: { product_id }, transaction: t });
}

/**
 * Delete attributes by Id.
 * @param {*} ids 
 * @returns 
 */
function deleteAttributesById(ids) {
    return productAttribute.destroy({ where: { id: ids } });
}

module.exports = {
    bulkCreateProductAttributes,
    bulkCreatePAT,
    createProductAttributes,
    getProdAttribute,
    getProdAttAndValById,
    getProdAttributeByPIDAID,
    updateProdAttribute,
    disableProductAttributesT,
    getProdAttributeAndValues,
    deleteAttributesById
}