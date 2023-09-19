const configRule = require('../../models').configuration_rules;

/**
 * Get All configuration rules.
 * @returns 
 */
function getAllConfigRules() {
    return configRule.findAll();
}

module.exports = {
    getAllConfigRules
}