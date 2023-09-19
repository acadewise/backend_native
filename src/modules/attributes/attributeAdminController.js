const attributeDao = require("./attributeDao");
const attributeValueDao = require("../attribute_values/attributeValueDao");
const attributeHelper = require("../../helper/module_helper/attribute_utility");
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit, generateUniqueString } = require('../../helper/helper_function');

/**
 * Create Attribute.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createAttribute = async (req, res) => {
  try {
    const { name, image, is_default, order, is_active, attribute_categories } = req.body;
    const attributeData = {
      name,
      slug: generateUniqueString(name),
      image,
      is_default,
      order,
      is_active,
      created_by: req.adminData.id,
    };
    const attributeRes = await attributeDao.create(attributeData);
    const attrCat = await attributeHelper.createAttributeCategories(attributeRes.id, attribute_categories);
    attributeRes.setDataValue("attribute_categories", attrCat);
    return responseHelper.successResponse(req, res, attributeRes, "Attribute successfully created");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Create Attribute with values.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createAttributeWithValues = async (req, res) => {
  try {
    const { name, image, is_default, order, is_active, attribute_categories, attribute_values } = req.body;
    const attributeData = {
      name,
      slug: generateUniqueString(name),
      image,
      is_default,
      order,
      is_active,
      created_by: req.adminData.id,
    };
    const attributeRes = await attributeDao.create(attributeData);
    const attrCat = await attributeHelper.createAttributeCategories(attributeRes.id, attribute_categories);
    attributeRes.setDataValue("attribute_categories", attrCat);
    const valRes = await attributeHelper.createAttributeValues(req.adminData.id, attributeRes.id, attribute_values);
    attributeRes.setDataValue("attribute_values", valRes);
    return responseHelper.successResponse(req, res, attributeRes, "Attribute successfully created");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Get All Attributes list.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllAttributes = async (req, res) => {
  try {
    const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
    const attributeList = await attributeDao.findAllWithValues(page, limit);
    const resData = {
      data: attributeList.rows,
      count: attributeList.count,
      page: originalPageValue,
      per_page: limit,
      total_pages: Math.ceil((attributeList.count / limit))
    }
    return responseHelper.successResponseWithCount(req, res, resData, "Attributes records successfully fetched");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Get Attributes details by Id.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAttributeById = async (req, res) => {
  try {
    const { id } = req.params;
    const attributeData = await attributeDao.findByIdWithValues(id);
    if (!attributeData) {
      return responseHelper.notFoundResponse(req, res, "Attribute not found");
    }
    return responseHelper.successResponse(req, res, attributeData, "Attribute data successfully fetched");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Update Attribute details.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = req.body;
    delete updates.id;
    delete updates.slug;
    let cateUpdate = updates.attribute_categories;
    delete updates.attribute_categories;
    let attributesRes = {};
    const attributeData = await attributeDao.findById(id);
    if (!attributeData) {
      return responseHelper.notFoundResponse(req, res, "Attribute not found");
    }
    if (updates) {
      updates.updated_by = req.adminData.id;
      const [count, attributeNewData] = await attributeDao.update(attributeData.id, updates);
      attributesRes = attributeNewData;
    } else {
      attributesRes = attributeData;
    }
    if (cateUpdate) {
      const updateAttrCat = await attributeHelper.updateAttrCategory(id, cateUpdate);
    }
    return responseHelper.successResponse(req, res, attributesRes, "Attribute record successfully updated");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Update Attribute details with values.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateAttributeAndValues = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = req.body;
    delete updates.slug;
    let valueUpdates = updates.attribute_values;
    let cateUpdate = updates.attribute_categories;
    delete updates.attribute_values;
    delete updates.attribute_categories;
    let attributesRes = {};
    const attributeData = await attributeDao.findById(id);
    if (!attributeData) {
      return responseHelper.notFoundResponse(req, res, "Attribute not found");
    }
    if (updates) {
      updates.updated_by = req.adminData.id;
      const [count, attributeNewData] = await attributeDao.update(attributeData.id, updates);
      attributesRes = attributeNewData;
    } else {
      attributesRes = attributeData;
    }

    if (cateUpdate) {
      const updateAttrCat = await attributeHelper.updateAttrCategory(id, cateUpdate);
    }

    if (valueUpdates) {
      const valRes = await attributeHelper.updateAttributeValue(id, req.adminData.id, valueUpdates);
    }

    return responseHelper.successResponse(req, res, attributesRes, "Attribute record successfully updated");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Soft Delete Attribute.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deleteAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const attributeData = await attributeDao.findById(id);
    if (!attributeData) {
      return responseHelper.notFoundResponse(req, res, "Attribute not found");
    }

    const attributeRes = await attributeDao.softDelete(attributeData.id);
    const delCondition = { where: { attribute_id: attributeData.id } };
    const attributeValRes = await attributeValueDao.softDeleteWithCondition(delCondition);
    const attributeCatRes = await attributeHelper.disableAttributeCategories(attributeData.id);

    return responseHelper.successResponse(req, res, attributeRes, "Attribute successfully deleted");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

module.exports = {
  createAttribute,
  createAttributeWithValues,
  getAllAttributes,
  getAttributeById,
  updateAttribute,
  updateAttributeAndValues,
  deleteAttribute,
};
