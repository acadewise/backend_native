const attributeCategory = require('../../models').attribute_categories;

/**
 * Bulk Create Attribute Categories.
 * @param {*} data 
 * @returns 
 */
 function bulkCreateAttributeCategories(data) {
    return attributeCategory.bulkCreate(data, { returning: true });
}

/**
 * Create Attribute Categories.
 * @param {*} data 
 * @returns 
 */
 function createAttributeCategories(data) {
    return attributeCategory.create(data);
}

/**
 * Get Attribute And Category.
 * @param {*} attribute_id
 * @returns 
 */
function getAttributeAndCategory(attribute_id) {
    return attributeCategory.findAll({
        where: {
            attribute_id
        }
    });
}

/**
 * Get Attribute Category.
 * @param {*} id
 * @returns 
 */
 function getAttributeCategory(id) {
    return attributeCategory.findOne({
        attributes: ['id', 'attribute_id', 'category_id', 'is_active'],
        where: {
            id
        }
    });
}

/**
 * Remove Multiple Attribute Category.
 * @param {*} attribute_id 
 * @param {*} obj 
 * @returns 
 */
function disableAttributeCategory(attribute_id, obj) {
    const updateObj = { is_active: false };
    return attributeCategory.update(updateObj, { where: { attribute_id }, returning: true});
}

/**
 * Update Attribute Category data.
 * @param {*} id
 * @param {*} updateObj
 * @returns 
 */
 function updateAttributeCategory(id, updateObj) {
    return attributeCategory.update(updateObj, { where: { id }, returning: true});
}

module.exports = {
    bulkCreateAttributeCategories,
    createAttributeCategories,
    getAttributeAndCategory,
    getAttributeCategory,
    disableAttributeCategory,
    updateAttributeCategory
}