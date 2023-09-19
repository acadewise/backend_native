
const { StatusCodes } = require('http-status-codes');
const categoryDao = require('../../modules/category/categoryDao');
const { Admin, Common } = require('../../constants/admin');


/**
 * 
 * @param {*} page 
 * @param {*} limit 
 * @param {*} obj 
 * @param {*} attributes 
 * @returns 
 */
const getAllCategoriesWithRules = async (customObj) => {
    try {
        const categoryList = await categoryDao.findAllCategoryWithObject(customObj);
        return {
            status: StatusCodes.OK,
            data: categoryList,
            error: null
        }
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            data: null,
            error
        }
    }
}


module.exports = {
    getAllCategoriesWithRules
}