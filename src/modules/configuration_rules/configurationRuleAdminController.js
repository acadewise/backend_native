const configRuleDao = require('./configurationRuleDao');
const { successResponse, internalServerError } = require('../../helper/response_utility');
/**
 * Get All configuration rules list.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getAllConfigRules = async (req, res) => {
    try {
        const ruleList = await configRuleDao.getAllConfigRules();
        return successResponse(req, res, ruleList, "Configuration Rule records successfully fetched")
    } catch (error) {
        return internalServerError(req, res, error);
    }
}

module.exports = {
    getAllConfigRules
}