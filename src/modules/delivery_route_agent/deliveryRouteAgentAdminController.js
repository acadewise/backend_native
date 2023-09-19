const deliveryRouteAgentDao = require("./deliveryRouteAgentDao");
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');

/**
 * Create supplier.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createDeliveryRoute = async (req, res) => {
    try {
        const { title, route_description, zip_code } = req.body;
        const requestData = {
            title,
            route_description,
            zip_code,
        };
        const resData = await deliveryRouteAgentDao.create(requestData);
        return responseHelper.successResponse(req, res, resData, "Delivery Route successfully created");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Get All suppliers list.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllDeliveryRouteAgent = async (req, res) => {
    try {
        let query = req.query;
        
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
       // const attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };
        const addressList = await deliveryRouteAgentDao.findAllWithAttributesAndPagination(query, page, limit)
        const resData = {
            data: addressList.rows,
            count: addressList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((addressList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "delivery route records successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Get suppliers details by Id.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getDeliveryRouteById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplierData = await deliveryRouteAgentDao.findById(id);
        if (!supplierData) {
            return responseHelper.notFoundResponse(req, res, "delivery route Data not found!");
        }
        return responseHelper.successResponse(req, res, supplierData, "delivery route data successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Update supplier details.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateDeliveryRoute = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = req.body;
        delete updates.id;
        const routeData = await deliveryRouteAgentDao.findById(id);
        if (!routeData) {
            return responseHelper.notFoundResponse(req, res, "Route Data not found!");
        }
        updates.updated_by = req.adminData.id;
        const [count, routeNewData] = await deliveryRouteAgentDao.update(routeData.id, updates);
        return responseHelper.successResponse(req, res, routeNewData, "Route record successfully updated");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

/**
 * Soft Delete supplier.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deleteDeliveryRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const routeData = await deliveryRouteAgentDao.findById(id);
        if (!routeData) {
            return responseHelper.notFoundResponse(req, res, "route Data not found!");
        }
        const routeRes = await deliveryRouteAgentDao.softDelete(routeData.id);
        return responseHelper.successResponse(req, res, routeRes, "route successfully deleted");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

module.exports = {
    createDeliveryRoute,
    
    getDeliveryRouteById,
    updateDeliveryRoute,
    deleteDeliveryRoute,
    getAllDeliveryRouteAgent
};
