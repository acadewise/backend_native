const moduleDao = require("./moduleDao");
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit, generateUniqueString } = require('../../helper/helper_function');

/**
 * Create Module.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createModule = async (req, res) => {
  try {
    const { name, is_active } = req.body;
    const moduleData = {
      name,
      identity: generateUniqueString(name),
      is_active,
      created_by: req.adminData.id,
    };
    const moduleRes = await moduleDao.create(moduleData);
    return responseHelper.successResponse(req, res, moduleRes, "Module successfully created");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Get All Modules list.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllModules = async (req, res) => {
  try {
    const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
    const moduleList = await moduleDao.findAndCountAll(page, limit);
    const resData = {
      data: moduleList.rows,
      count: moduleList.count,
      page: originalPageValue,
      per_page: limit,
      total_pages: Math.ceil((moduleList.count / limit))
    }
    return responseHelper.successResponseWithCount(req, res, resData, "Modules records successfully fetched");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Get Modules details by Id.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getModuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const moduleData = await moduleDao.findById(id);
    if (!moduleData) {
      return responseHelper.notFoundResponse(req, res, "Module not found!");
    }
    return responseHelper.successResponse(req, res, moduleData, "Module data successfully fetched");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Update Module details.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = req.body;
    delete updates.id;
    delete updates.identity;
    const moduleData = await moduleDao.findById(id);
    if (!moduleData) {
      return responseHelper.notFoundResponse(req, res, "Module not found!");
    }
    updates.updated_by = req.adminData.id;
    const [count, moduleNewData] = await moduleDao.update(moduleData.id, updates);
    return responseHelper.successResponse(req, res, moduleNewData, "Module record successfully updated");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Soft Delete Module.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    const moduleData = await moduleDao.findById(id);
    if (!moduleData) {
      return responseHelper.notFoundResponse(req, res, "Module not found!");
    }
    const moduleRes = await moduleDao.softDelete(moduleData.id);
    return responseHelper.successResponse(req, res, moduleRes, "Module successfully deleted");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

module.exports = {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
};
