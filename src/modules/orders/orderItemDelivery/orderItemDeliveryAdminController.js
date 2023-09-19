const orderItemDeliveryDao = require("./orderItemDeliveryDao");
const responseHelper = require('../../../helper/response_utility');
const { getPageAndLimit } = require('../../../helper/helper_function');
const orderDao = require('./../../orders/order/orderDao');
const userDao = require('../../user/userDao');
const deliveryPointAddressDao = require('../../delivery_point_address/deliveryPointAddressDao');
const adminDao = require('../../admin/adminDao');

/**
 * Create supplier.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createOrderItemDelivery = async (req, res) => {
    try {

        if (req && req.body.length > 0) {
            let resData = [];
            req.body.map(async (bodyItem, index) => {
                let id = bodyItem.id;
                let requestData = {
                    delivery_agent_id: bodyItem.delivery_agent_id,
                    delivery_point_address_id: bodyItem.delivery_point_address_id,
                    delivery_date: bodyItem.delivery_date,
                    delivery_time: bodyItem.delivery_time,
                    route_id: bodyItem.route_id || 0
                };
                resData = await orderItemDeliveryDao.update(id, requestData);

                return bodyItem;

            });
            return responseHelper.successResponse(req, res, resData, "Delivery Agent successfully assigned");

        } else {
            return responseHelper.notFoundResponse(req, res, "Not Found");
        }
        return;


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
const getAllOrderItemDelivery = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };
        const addressList = await orderItemDeliveryDao.findAllWithAttributesAndPagination(attributes, page, limit)
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
const getOrderItemDeliveryById = async (req, res) => {
    try {
        const { id } = req.params;
        const deliveryItemData = await orderItemDeliveryDao.findByOrderId(id);
        if (!deliveryItemData) {
            return responseHelper.notFoundResponse(req, res, "delivery route Data not found!");
        }
        return responseHelper.successResponse(req, res, deliveryItemData, "delivery item data successfully fetched");
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
const updateOrderItemDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = req.body;
        delete updates.id;
        const routeData = await orderItemDeliveryDao.findById(id);
        if (!routeData) {
            return responseHelper.notFoundResponse(req, res, "Route Data not found!");
        }
        updates.updated_by = req.adminData.id;
        const [count, routeNewData] = await orderItemDeliveryDao.update(routeData.id, updates);
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
const deleteOrderItemDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        const routeData = await orderItemDeliveryDao.findById(id);
        if (!routeData) {
            return responseHelper.notFoundResponse(req, res, "route Data not found!");
        }
        const routeRes = await orderItemDeliveryDao.softDelete(routeData.id);
        return responseHelper.successResponse(req, res, routeRes, "route successfully deleted");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};


const getDeliverablesItems = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        console.log("req", req.query)
        const attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };
        const addressList = await orderItemDeliveryDao.getDeliverablesItems(attributes, page, limit,req.query)
        const resData = {
            data: addressList.rows,
            count: addressList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((addressList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "Deliverables Items successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

module.exports = {
    createOrderItemDelivery,
    getAllOrderItemDelivery,
    getOrderItemDeliveryById,
    updateOrderItemDelivery,
    deleteOrderItemDelivery,
    getDeliverablesItems
};
