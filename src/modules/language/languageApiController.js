const languageDao = require('./languageDao');
const { Language } = require('../../constants/api');
const { internalServerError, successResponse } = require('../../helper/response_utility');

/**
 * Get all Languages List.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getAllLanguages = async (req, res) => {
    try {
        const languages = await languageDao.findAll();
        return successResponse(req, res, languages, Language.LANGUAGE_SUCC_FECHED);
    } catch (error) {
        return internalServerError(req, res, error);
    }
}

module.exports = {
    getAllLanguages
}