const unitDao = require("./unitDao");
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');

/**
 * Create Unit.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createUnit = async (req, res) => {
  try {
    const { name, slug, is_active } = req.body;
    const unitData = {
      name,
      slug,
      is_active,
      created_by: req.adminData.id
    };
    let checkUniqueData = await unitDao.checkUniqueUnitName(name);
    if (checkUniqueData) {
      return responseHelper.notFoundResponse(req, res, 'Unit name already in use.');
    }
    const unitRes = await unitDao.create(unitData);
    return responseHelper.successResponse(req, res, unitRes, "Unit successfully created");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
}

/**
 * Get All Units list.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllUnits = async (req, res) => {
  try {
    const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
    const attributes = ['id', 'name', 'slug', 'is_active']
    const unitList = await unitDao.findAllWithAttributesAndPagination(attributes, page, limit)
    const resData = {
      data: unitList.rows,
      count: unitList.count,
      page: originalPageValue,
      per_page: limit,
      total_pages: Math.ceil((unitList.count / limit))
    }
    return responseHelper.successResponseWithCount(req, res, resData, "Units records successfully fetched");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
}

/**
 * Get Units details by Id.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    const unitData = await unitDao.findById(id);
    if (!unitData) {
      return responseHelper.notFoundResponse(req, res, "Unit Data not found!");
    }
    return responseHelper.successResponse(req, res, unitData, "Unit data successfully fetched");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
}

/**
 * Update Unit details.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = req.body;
    delete updates.id;
    const unitData = await unitDao.findById(id);
    if (!unitData) {
      return responseHelper.notFoundResponse(req, res, "Unit Data not found!");
    }
    updates.updated_by = req.adminData.id;
    const [count, unitNewData] = await unitDao.update(unitData.id, updates);
    return responseHelper.successResponse(req, res, unitNewData, "Unit record successfully updated");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Soft Delete Unit.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const unitData = await unitDao.findById(id);
    if (!unitData) {
      return responseHelper.notFoundResponse(req, res, "Unit Data not found!");
    }
    const unitRes = await unitDao.softDelete(unitData.id);
    return responseHelper.successResponse(req, res, unitRes, "Unit successfully deleted");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

module.exports = {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
};
