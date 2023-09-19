const { Category } = require('../../constants/api');
const categoryModel = require('../../models').categories;
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');
const categoryUtility = require('../../helper/module_helper/category_utility');

/**
* Get all categories List.
* @param {*} req 
* @param {*} res 
* @returns 
*/
const getAllCategories = async (req, res) => {
    try {
        // Pagination
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        // Attributes
        const attributes = ['id', 'name', 'image', 'category_color_code', 'description'];
        const customObj = {
            offset: page, limit, distinct: true, attributes,
            where: { 'show_on_web': true, 'status': true },
            include: [{
                model: categoryModel,
                required: false,
                as: 'sub_category',
                attributes
            }]
        }
        // Service Calling
        const { status, data, error } = await categoryUtility.getAllCategoriesWithRules(customObj);
        return responseHelper.apiResponseSuccessList(req, res, status, data, error, limit, originalPageValue, Category.CAT_SUCC_FECHED);
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getSubCategories = async (req, res) => {
    try {
        // Pagination
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        // Attributes
        const attributes = ['id', 'name', 'image', 'category_color_code'];
        const customObj = {
            offset: page, limit, distinct: true,
            attributes, where: { parent_id: req.params.id },
            include: [{
                model: categoryModel,
                required: false,
                as: 'sub_category',
                attributes
            }]
        }
        // Service Calling
        const { status, data, error } = await categoryUtility.getAllCategoriesWithRules(customObj);
        return responseHelper.apiResponseSuccessList(req, res, status, data, error, limit, originalPageValue, 'sub categories are successfully fetched.');

    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getAllParentCategories = async (req, res) => {
    try {
        // Pagination
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        // Attributes
        const attributes = ['id', 'name', 'image', 'category_color_code'];
        const customObj = {
            offset: page, limit, distinct: true,
            attributes, where: { parent_id: 0 },
            include: [{
                model: categoryModel,
                required: false,
                as: 'sub_category',
                attributes
            }]
        }
        // Service Calling
        const { status, data, error } = await categoryUtility.getAllCategoriesWithRules(customObj);
        return responseHelper.apiResponseSuccessList(req, res, status, data, error, limit, originalPageValue, 'Parent categories are successfully fetched.');

    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

module.exports = {
    getAllCategories,
    getSubCategories,
    getAllParentCategories
}