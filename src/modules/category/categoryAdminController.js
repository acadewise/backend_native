const categoryDao = require('./categoryDao');
const catConfigDao = require('./category_config_rule/categoryConfigRuleDao');
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');
const { checkUnique } = require('../common/commonAdminController');

/**
 * Get all categories List.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getAllCategories = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const categoryList = await categoryDao.findAllWithRules(page, limit);
        const resData = {
            data: categoryList.rows,
            count: categoryList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((categoryList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "Category records successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Get category details by Id.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryDao.findById(id);
        if (!category) {
            return responseHelper.notFoundResponse(req, res, 'Category not found!');
        }
        const categoryData = await categoryDao.findOneWithRules({ id: category.id })
        return responseHelper.successResponse(req, res, categoryData, "Category successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Create Category.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const createCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        const confRule = categoryData.category_configuration_rules;
        delete categoryData.category_configuration_rules;
        categoryData.created_by = req.adminData.id;
        let checkUniqueData = await categoryDao.checkUniqueCatName(categoryData.name);
        if (checkUniqueData) {
            return responseHelper.notFoundResponse(req, res, 'Category name already in use.');
        }

        const category = await categoryDao.create(categoryData);
        if (confRule) {
            const confRuleData = await createCategoryConfigRule(category.id, confRule);
            category.setDataValue('cat_config_rules', confRuleData);
        } else {
            category.setDataValue('cat_config_rules', []);
        }
        return responseHelper.successResponse(req, res, category, "Category successfully created");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * create Category Config Rule.
 * @param {*} category_id 
 * @param {*} confRule 
 * @returns 
 */
const createCategoryConfigRule = async (category_id, confRule) => {
    const ruleData = confRule.map((cR) => {
        return {
            category_id,
            rule_id: cR
        }
    });
    const ruleRes = await catConfigDao.bulkCreate(ruleData);
    return ruleRes;
}

/**
 * Update Category Details.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryPayload = req.body;
        delete categoryPayload.id;
        const category = await categoryDao.findById(id);
        const catConfigRule = categoryPayload.category_configuration_rules;
        if (!category) {
            return responseHelper.notFoundResponse(req, res, 'Category not found!');
        }

        let checkUniqueData = await categoryDao.checkUniqueCategoryAttributeUpdate('name', categoryPayload.name, category.id);
        if (checkUniqueData) {
            return responseHelper.notFoundResponse(req, res, 'Category name already in use.');
        }

        categoryPayload.updated_by = req.adminData.id;
        const [count, categoryData] = await categoryDao.update(category.id, categoryPayload);
        if (catConfigRule) {
            await updateCategoryConfigRule(id, catConfigRule);
        }
        return responseHelper.successResponse(req, res, categoryData, "Category successfully updated");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * update Category Config Rule.
 * @param {*} confRule
 * @returns
 */
const updateCategoryConfigRule = async (category_id, confRule) => {
    const valRes = [];
    if (confRule.length) {
        for (let val of confRule) {
            if (val.id != undefined) {
                let id = val.id;
                let attrVal = await catConfigDao.findByRuleAndCatId(val.rule_id, category_id);
                if (attrVal) {
                    const upObj = {
                        is_active: val.is_active === undefined ? true : val.is_active
                    };
                    const [count, valNewData] = await catConfigDao.update(attrVal.id, upObj);
                    valRes.push(valNewData);
                }
            } else {
                if (val.rule_id && val.category_id) {
                    const exists = await catConfigDao.findByRuleAndCatId(val.rule_id, category_id);
                    if (!exists) {
                        const valObj = {
                            rule_id: val.rule_id,
                            category_id
                        };
                        const valData = await catConfigDao.create(valObj);
                        valRes.push(valData);
                    } else {
                        const upObj = {
                            is_active: val.is_active === undefined ? true : val.is_active
                        };
                        const [count, valNewData] = await catConfigDao.update(exists.id, upObj);
                        valRes.push(valNewData);
                    }
                }
            }
        }
    }
    return valRes;
}

/**
 * Soft delete category. 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        const category = await categoryDao.findById(id);
        if (!category) {
            return responseHelper.notFoundResponse(req, res, 'Category not found!');
        }
        const deletedData = await categoryDao.softDelete(category.id);
        return responseHelper.successResponse(req, res, deletedData, "Category successfully deleted");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Get Attributes and values wrt category.
 * @param {*} req
 * @param {*} res
 */
const getCategoryAttributes = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryDao.findById(id);
        if (!category) {
            return responseHelper.notFoundResponse(req, res, 'Category not found!');
        }
        const categoryData = await categoryDao.getCatAttVal(id);
        return responseHelper.successResponse(req, res, categoryData, "Category Attributes and values successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    createCategoryConfigRule,
    updateCategory,
    updateCategoryConfigRule,
    deleteCategory,
    getCategoryAttributes
}
