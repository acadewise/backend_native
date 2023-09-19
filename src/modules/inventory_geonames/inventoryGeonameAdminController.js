const inventoryGeonameDao = require('./inventoryGeonameDao');
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');

/**
 * Create InventoryGeoname.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createInventoryGeoname = async (req, res) => {
    try {
        const { country_code, zip_code, region, city, province, latitude, longitude, is_active,zip_description } = req.body;
        const inventoryGeonameData = {
            country_code,
            zip_code,
            region,
            city,
            province,
            latitude,
            longitude,
            is_active,
            zip_description
        };
        const inventoryGeonameRes = await inventoryGeonameDao.create(inventoryGeonameData);
        return responseHelper.successResponse(req, res, inventoryGeonameRes, "InventoryGeoname successfully created.");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

/**
 * Get All InventoryGeoname list.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllInventoryGeoname = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const attributes = {
            exclude: ['updateAt']
        }
        const inventoryGeonameList = await inventoryGeonameDao.findAllWithAttributesAndPagination(page, limit, attributes);
        const resData = {
            data: inventoryGeonameList.rows,
            count: inventoryGeonameList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((inventoryGeonameList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "InventoryGeoname records successfully fetched.");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

/**
 * Get InventoryGeoname details by Id.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getInventoryGeonameById = async (req, res) => {
    try {
        const { id } = req.params;
        const inventoryGeonameData = await inventoryGeonameDao.findById(id);
        if (!inventoryGeonameData) {
            return responseHelper.notFoundResponse(req, res, "InventoryGeoname not found!");
        }
        return responseHelper.successResponse(req, res, inventoryGeonameData, "InventoryGeoname data successfully fetched.");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

/**
 * Get InventoryGeoname List by Array.
 * @param {*} req
 * @param {*} res
 * @returns
 */
 const getInventoryGeonameList = async (req, res) => {
     console.log("req==>",req.query);
    // return;
    try {
        const { zipcode } = req.query;
        const inventoryGeonameData = await inventoryGeonameDao.findWithArrayObject(zipcode);
        if (!inventoryGeonameData) {
            return responseHelper.notFoundResponse(req, res, "InventoryGeoname not found!");
        }
        return responseHelper.successResponse(req, res, inventoryGeonameData, "InventoryGeoname data successfully fetched.");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

/**
 * Update InventoryGeoname details.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateInventoryGeoname = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = req.body;
        delete updates.id;
        const inventoryGeonameData = await inventoryGeonameDao.findById(id);
        if (!inventoryGeonameData) {
            return responseHelper.notFoundResponse(req, res, "InventoryGeoname not found!");
        }
        const [count, inventoryGeonameNewData] = await inventoryGeonameDao.update(inventoryGeonameData.id, updates);
        return responseHelper.successResponse(req, res, inventoryGeonameNewData, "InventoryGeoname record successfully updated.");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

/**
 * Soft Delete InventoryGeoname.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deleteInventoryGeoname = async (req, res) => {
    try {
        const { id } = req.params;
        const inventoryGeonameData = await inventoryGeonameDao.findById(id);
        if (!inventoryGeonameData) {
            return responseHelper.notFoundResponse(req, res, "InventoryGeoname not found!");
        }
        const inventoryGeonameRes = await inventoryGeonameDao.softDelete(inventoryGeonameData.id);
        return responseHelper.successResponse(req, res, inventoryGeonameRes, "InventoryGeoname successfully deleted.");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

module.exports = {
    createInventoryGeoname,
    getAllInventoryGeoname,
    getInventoryGeonameById,
    updateInventoryGeoname,
    deleteInventoryGeoname,
    getInventoryGeonameList
};
