const _ = require('lodash');
const { Unique_Fields } = require('../../constants/admin');
const responseHelper = require('../../helper/response_utility');
const { checkUniqueCatName } = require('../category/categoryDao');
const { checkUniqueLangCode } = require('../language/languageDao');
const { checkUniqueAdminEmail } = require('../admin/adminDao');
const { checkUniqueUserAttribute } = require('../user/userDao');
const { checkUniqueUnitSlug } = require('../units/unitDao');

/**
 * Check value exist in database wrt type.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const checkUnique = async (req, res) => {
    try {
        const { type, value } = req.query;
        let result = '';
        switch (type) {
            case Unique_Fields[0]:
                result = await checkUniqueCatName(value);
                break;
            case Unique_Fields[1]:
                result = await checkUniqueLangCode(value);
                break;
            case Unique_Fields[2]:
                result = await checkUniqueAdminEmail(value);
                break;
            case Unique_Fields[3]:
                result = await checkUniqueUserAttribute('email', value);
                break;
            case Unique_Fields[4]:
                result = await checkUniqueUserAttribute('phone_number', value);
                break;
            case Unique_Fields[7]:
                result = await checkUniqueUnitSlug(value);
                break;
            default:
                break;
        }
        console.log("===>hey")
        if (_.isEmpty(result)) {
            return responseHelper.successResponse(req, res, 'Entered value already in use.');
        }
        return responseHelper.badReqResponse(req, res, 'Entered value is not unique!');
    } catch (error) {
        console.log("===>hey");
        return;
        return responseHelper.internalServerError(req, res, error);
    }
}

module.exports = {
    checkUnique
}