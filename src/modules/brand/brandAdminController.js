const brandDao = require("./brandDao");
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');

/**
 * Create Brand.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createBrand = async (req, res) => {
  try {
    const { name, description, website, logo, is_active, is_featured, position } = req.body;
    const brandData = {
      name,
      description,
      website,
      logo,
      is_active,
      is_featured,
      position,
      created_by: req.adminData.id
    };
    const brandRes = await brandDao.create(brandData);
    return responseHelper.successResponse(req, res, brandRes, "Brand successfully created");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Get All Brands list.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllBrands = async (req, res) => {
  try {
    const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
    const attributes = ['id', 'name', 'description', 'website', 'logo', 'is_active', 'is_featured', 'position']
    const brandList = await brandDao.findAllWithAttributesAndPagination(attributes, page, limit);
    const resData = {
      data: brandList.rows,
      count: brandList.count,
      page: originalPageValue,
      per_page: limit,
      total_pages: Math.ceil((brandList.count / limit))
    }
    return responseHelper.successResponseWithCount(req, res, resData, "Brands records successfully fetched.");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Get Brands details by Id.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brandData = await brandDao.findById(id);
    if (!brandData) {
      return responseHelper.notFoundResponse(req, res, "Brand not found!");
    }
    return responseHelper.successResponse(req, res, brandData, "Brand data successfully fetched.");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Update Brand details.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = req.body;
    delete updates.id;
    const brandData = await brandDao.findById(id);
    if (!brandData) {
      return responseHelper.notFoundResponse(req, res, "brand not found!");
    }
    updates.updated_by = req.adminData.id;
    const [count, brandNewData] = await brandDao.update(brandData.id, updates);
    return responseHelper.successResponse(req, res, brandNewData, "brand record successfully updated.");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 * Soft Delete Brand.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brandData = await brandDao.findById(id);
    if (!brandData) {
      return responseHelper.notFoundResponse(req, res, "Brand not found!");
    }
    const brandRes = await brandDao.softDelete(brandData.id);
    return responseHelper.successResponse(req, res, brandRes, "Brand successfully deleted.");
  } catch (error) {
    return responseHelper.internalServerError(req, res, error);
  }
};

module.exports = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
