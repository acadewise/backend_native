const orderDeliveryAgentDao = require("./orderDeliveryAgentDao");
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');
const orderDao = require('./../orders/order/orderDao');
const userDao = require('../user/userDao');
const deliveryPointAddressDao = require('../delivery_point_address/deliveryPointAddressDao');
const adminDao = require('../admin/adminDao');

/**
 * Create supplier.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createOrderDeliveryAgent = async (req, res) => {
    try {

        const { order_id, delivery_agent_id, user_id, delivery_point_address_id, delivery_date, delivery_time, remarks, delivery_status } = req.body;
        const requestData = {
            order_id,
            delivery_agent_id,
            user_id,
            delivery_point_address_id,
            delivery_date,
            delivery_time,
            remarks,
            delivery_status
        };


        const customer = await userDao.findById(user_id);
        if (!customer) {
            return responseHelper.notFoundResponse(req, res, 'Invalid customer!');
        }

        const order = await orderDao.findById(order_id);
        if (!order) {
            return responseHelper.notFoundResponse(req, res, 'Invalid order!');
        }

        const pointaddress = await deliveryPointAddressDao.checkById(delivery_point_address_id);
        if (!pointaddress) {
            return responseHelper.notFoundResponse(req, res, 'Invalid address!');
        }
        const deliveryAgent = await adminDao.findById(delivery_agent_id);
        if (!deliveryAgent) {
            return responseHelper.notFoundResponse(req, res, 'Invalid delivery agent!');
        }

        const checkDeliveryganet = await orderDeliveryAgentDao.checkAlreadyExits(order_id, delivery_agent_id);
       
        if (checkDeliveryganet) {
            const id =   checkDeliveryganet.id;
            delete id;
            const resData = await orderDeliveryAgentDao.update(id, requestData);
            return responseHelper.successResponse(req, res, resData, "Delivery Route successfully created");
        } else {
            const resData = await orderDeliveryAgentDao.create(requestData);
            return responseHelper.successResponse(req, res, resData, "Delivery Route successfully created");
        }

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
const getAllOrderDeliveryAgent = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };
        const addressList = await orderDeliveryAgentDao.findAllWithAttributesAndPagination(attributes, page, limit)
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
const getOrderDeliveryAgentById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplierData = await orderDeliveryAgentDao.findById(id);
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
const updateOrderDeliveryAgent = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = req.body;
        delete updates.id;
        const routeData = await orderDeliveryAgentDao.findById(id);
        if (!routeData) {
            return responseHelper.notFoundResponse(req, res, "Route Data not found!");
        }
        updates.updated_by = req.adminData.id;
        const [count, routeNewData] = await orderDeliveryAgentDao.update(routeData.id, updates);
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
const deleteOrderDeliveryAgent = async (req, res) => {
    try {
        const { id } = req.params;
        const routeData = await orderDeliveryAgentDao.findById(id);
        if (!routeData) {
            return responseHelper.notFoundResponse(req, res, "route Data not found!");
        }
        const routeRes = await orderDeliveryAgentDao.softDelete(routeData.id);
        return responseHelper.successResponse(req, res, routeRes, "route successfully deleted");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

module.exports = {
    createOrderDeliveryAgent,
    getAllOrderDeliveryAgent,
    getOrderDeliveryAgentById,
    updateOrderDeliveryAgent,
    deleteOrderDeliveryAgent,
};
