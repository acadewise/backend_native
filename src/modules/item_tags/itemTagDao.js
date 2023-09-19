const itemTag = require('../../models').item_tags;

/**
 * Bulk Create item tags.
 * @param {*} data 
 * @returns 
 */
function bulkCreateItemTag(data) {
    return itemTag.bulkCreate(data, { returning: true });
}

/**
 * Bulk Create item tags with transaction.
 * @param {*} data 
 * @param {*} t
 * @returns 
 */
function bulkCreateITT(data, t) {
    return itemTag.bulkCreate(data, { transaction: t }, { returning: true });
}

/**
 * Create item tags.
 * @param {*} data 
 * @param {*} t
 * @returns 
 */
function createItemTag(data, t) {
    return itemTag.create(data, { transaction: t });
}

/**
 * Disable Item tags.
 * @param {*} item_id 
 * @param {*} t
 * @returns
 */
function disableItemTagsT(item_id, t) {
    const update = {
        is_active: false
    };
    return itemTag.update(update, { where: { item_id }, transaction: t });
}

/**
 * Update Item tags.
 * @param {*} item_id 
 * @param {*} t
 * @returns
 */
function updateItemTags(id, updateObj, t) {
    return itemTag.update(updateObj, { where: { id }, transaction: t });
}

/**
 * Remove Item tags by Id.
 * @param {*} ids 
 * @returns
 */
function removeItemTagById(ids) {
    return itemTag.destroy({ where: { id: ids } });
}

/**
 * Get Item tags by item_id and tag_id.
 * @param {*} item_id 
 * @param {*} tag_id 
 * @param {*} t
 * @returns
 */
function getItemTagByIidAndTid(item_id, tag_id, t) {
    return itemTag.findOne({
        attributes: ['id', 'item_id', 'tag_id', 'is_active'],
        where: { item_id, tag_id }, transaction: t
    });
}

/**
 * Get Item tag by id.
 * @param {*} id 
 * @param {*} t
 * @returns
 */
function getItemTagById(id, t) {
    return itemTag.findOne({
        attributes: ['id', 'item_id', 'tag_id', 'is_active'],
        where: { id }, transaction: t
    });
}


module.exports = {
    bulkCreateItemTag,
    bulkCreateITT,
    createItemTag,
    disableItemTagsT,
    updateItemTags,
    removeItemTagById,
    getItemTagByIidAndTid,
    getItemTagById
}