const attributeValueDao = require("./attributeValueDao");
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');

/**
 * Create AttributeValue.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createAttributeValue = async (req, res) => {
  try {
    const { attribute_id, label, value, image, is_default, order, is_active } = req.body;
    const attributeValueData = {
      attribute_id,
      label,
      value,
      image,
      is_default,
      order,
      is_active,
      created_by: req.adminData.id,
    };
    const attributeValueRes = await attributeValueDao.create(attributeValueData);
    return responseHelper.successResponse(req, res, attributeValueRes, "AttributeValue successfully created");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Get All AttributeValues list.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllAttributeValues = async (req, res) => {
  try {
    const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
    const attributeList = await attributeValueDao.findAll(page, limit);
    const resData = {
      data: attributeList.rows,
      count: attributeList.count,
      page: originalPageValue,
      per_page: limit,
      total_pages: Math.ceil((attributeList.count / limit))
    }
    return responseHelper.successResponseWithCount(req, res, resData, "AttributeValues records successfully fetched");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Get AttributeValues details by Id.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAttributeValueById = async (req, res) => {
  try {
    const { id } = req.params;
    const attributeValueData = await attributeValueDao.findById(id);
    if (!attributeValueData) {
      return responseHelper.notFoundResponse(req, res, "AttributeValue not found");
    }
    return responseHelper.successResponse(req, res, attributeValueData, "AttributeValue data successfully fetched");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Update AttributeValue details.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateAttributeValue = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = req.body;
    delete updates.id;
    const attributeValueData = await attributeValueDao.findById(id);
    if (!attributeValueData) {
      return responseHelper.notFoundResponse(req, res, "AttributeValue not found");
    }
    updates.updated_by = req.adminData.id;
    const [count, attributeValueNewData] = await attributeValueDao.update(attributeValueData.id, updates);
    return responseHelper.successResponse(req, res, attributeValueNewData, "AttributeValue record successfully updated");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Soft Delete AttributeValue.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deleteAttributeValue = async (req, res) => {
  try {
    const { id } = req.params;
    const attributeValueData = await attributeValueDao.findById(id);
    if (!attributeValueData) {
      return responseHelper.notFoundResponse(req, res, "AttributeValue not found");
    }
    const attributeValueRes = await attributeValueDao.softDelete(attributeValueData.id);
    return responseHelper.successResponse(req, res, attributeValueRes, "AttributeValue successfully deleted");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

module.exports = {
  createAttributeValue,
  getAllAttributeValues,
  getAttributeValueById,
  updateAttributeValue,
  deleteAttributeValue,
};
