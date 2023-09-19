const catConfigRule = require('../../../models').category_configuration_rules;

/**
 * bulk create category configuration rules.
 * @returns 
 */
function bulkCreate(data) {
    return catConfigRule.bulkCreate(data, { returning: true });
}

/**
 * Create category configuration rules.
 * @returns 
 */
function create(data) {
    return catConfigRule.create(data);
}

/**
 * update category configuration rules.
 * @param {*} id
 * @param {*} data
 * @returns 
 */
function update(id, data) {
    return catConfigRule.update(data, { where: { id } });
}

/**
 * find By Id category configuration rules.
 * @param {*} id
 * @returns 
 */
function findById(id) {
    return catConfigRule.findOne({ where: { id }, attributes: ['id', 'rule_id', 'category_id', 'is_active'] });
}

/**
 * find By rule and category Id in category configuration rules.
 * @param {*} rule_id 
 * @param {*} category_id 
 * @returns 
 */
function findByRuleAndCatId(rule_id, category_id) {
    return catConfigRule.findOne({ where: { rule_id, category_id }, attributes: ['id', 'rule_id', 'category_id', 'is_active'] });
}

module.exports = {
    bulkCreate,
    create,
    update,
    findById,
    findByRuleAndCatId
}