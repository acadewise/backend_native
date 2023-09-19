const prodConfigRule = require('../../../models').product_configuration_rules;

/**
 * bulk create product configuration rules.
 * @returns 
 */
function bulkCreate(data) {
    return prodConfigRule.bulkCreate(data, { returning: true });
}

/**
 * bulk create product configuration rules with transaction.
 * @returns 
 */
function bulkCreateT(data, t) {
    return prodConfigRule.bulkCreate(data, { transaction: t }, { returning: true });
}

/**
 * Create product configuration rules.
 * @returns 
 */
function create(data) {
    return prodConfigRule.create(data);
}

/**
 * Create product configuration rules.
 * @param {*} data
 * @param {*} t
 * @returns 
 */
function createT(data, t) {
    return prodConfigRule.create(data, { transaction: t });
}

/**
 * Get product configuration rule by id.
 * @param {*} id
 * @returns
 */
function getById(id) {
    return prodConfigRule.findOne({
        attributes: ['id', 'rule_id', 'product_id', 'is_active'],
        where: { id }
    });
}

/**
 * Get product configuration rule by id.
 * @param {*} id
 * @param {*} t 
 * @returns
 */
function getByIdT(id, t) {
    return prodConfigRule.findOne({
        attributes: ['id', 'rule_id', 'product_id', 'is_active'],
        where: { id }, transaction: t
    });
}

/**
 * Get product configuration rule by rule_id and product_id.
 * @param {*} rule_id
 * @param {*} product_id  
 * @param {*} t
 * @returns
 */
function getByRidAndPid(rule_id, product_id, t) {
    return prodConfigRule.findOne({
        attributes: ['id', 'rule_id', 'product_id', 'is_active'],
        where: { rule_id, product_id }, transaction: t
    });
}

/**
 * Update product configuration rule by id.
 * @param {*} id 
 * @param {*} updateObj
 * @returns
 */
function update(id, updateObj, t) {
    return prodConfigRule.update(updateObj, { where: { id } });
}

/**
 * Update product configuration rule by id.
 * @param {*} id 
 * @param {*} updateObj
 * @param {*} t
 * @returns
 */
function updateT(id, updateObj, t) {
    return prodConfigRule.update(updateObj, { where: { id }, transaction: t });
}

/**
 * Disable product configuration rule by id.
 * @param {*} product_id
 * @returns
 */
function disableT(product_id, t) {
    const updateObj = {
        is_active: false,
    };
    return prodConfigRule.update(updateObj, { where: { product_id }, transaction: t });
}


module.exports = {
    bulkCreate,
    bulkCreateT,
    create,
    createT,
    getById,
    getByIdT,
    getByRidAndPid,
    update,
    updateT,
    disableT
}