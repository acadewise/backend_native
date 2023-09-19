const attributeValueDao = require('../../modules/attribute_values/attributeValueDao');
const attributeCategoryDao = require('../../modules/attribute_category/attributeCategoryDao');

/**
 * create Attribute Values.
 */
const createAttributeValues = async (created_by, attributeId, values) => {
    let valData = values.map((val) => {
        val.attribute_id = attributeId;
        val.created_by = created_by;
        return val;
    });
    const valRes = await attributeValueDao.bulkCreate(valData);
    return valRes;
}

/**
 * update Attribute Values.
 * @param {*} valueUpdates
 * @retruns
 */
const updateAttributeValue = async (attribute_id, created_by, valueUpdates) => {
    const valRes = [];
    if (valueUpdates.length) {
        for (let val of valueUpdates) {
            if (val.id != undefined) {
                let id = val.id;
                let attrVal = await attributeValueDao.findById(id);
                if (attrVal) {
                    const valueChanges = val;
                    delete valueChanges.id;
                    const [count, valNewData] = await attributeValueDao.update(id, valueChanges);
                    valRes.push(...valNewData);
                }
            } else {
                if (val.label && val.value) {
                    const valObj = {
                        attribute_id,
                        label: val.label,
                        value: val.value,
                        image: val.image,
                        is_default: val.is_default,
                        order: val.order,
                        is_active: val.is_active,
                        created_by
                    };
                    const valData = await attributeValueDao.create(valObj);
                    valRes.push(valData);
                }
            }
        }
    }
    return valRes;
}

/**
 * create Attribute Categories.
 * @param {*} categories
 * @returns
 */
const createAttributeCategories = async (attributeId, categories) => {
    const attrCat = categories.map((cat) => {
        return {
            attribute_id: attributeId,
            category_id: cat
        }
    });
    const AttrCatRes = await attributeCategoryDao.bulkCreateAttributeCategories(attrCat);
    return AttrCatRes;
}

/**
 * update Attribute Categories.
 * @param {*} id 
 * @param {*} attrCat 
 */
const updateAttrCategory = async (id, attrCat) => {
    let res = [];
    for (let ac of attrCat) {
        if (ac.id != undefined) {
            const atcData = attributeCategoryDao.getAttributeCategory(ac.id);
            if (atcData) {
                const updateObj = { 
                    is_active: ac.is_active
                }
                const [count, update] = await attributeCategoryDao.updateAttributeCategory(id, updateObj);
                res.push(...update);
            }
        } else {
            let add = { 
                attribute_id: ac.attribute_id, 
                category_id: ac.category_id,
                is_active: ac.is_active
            }
            const addData = await attributeCategoryDao.createAttributeCategories(add);
            res.push(addData);
        }
    }
    return res;
}

/**
 * Disable Attribute Categories.
 * @param {*} attributeId 
 */
const disableAttributeCategories = async (attributeId) => {
    const [count, disableAttCat] = await attributeCategoryDao.disableAttributeCategory(attributeId);
    return disableAttCat;
}

module.exports = {
    createAttributeValues,
    updateAttributeValue,
    createAttributeCategories,
    updateAttrCategory,
    disableAttributeCategories
}