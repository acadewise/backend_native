const deliveryPointAddressDao = require("./deliveryPointAddressDao");
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');

/**
 * Create supplier.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createDeliveryAddress = async (req, res) => {
    try {
        const {delivery_point_name,delivery_point_details, street_address, land_mark, city, state, pincode, delivery_type } = req.body;
        const requestData = {
            street_address,
            land_mark,
            city,
            state,
            pincode,
            delivery_type,
            delivery_point_name,
            delivery_point_details
        };
        const resData = await deliveryPointAddressDao.create(requestData);
        return responseHelper.successResponse(req, res, resData, "Delivery Address successfully created");
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
const getAllDeliveryAddress = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };
        const addressList = await deliveryPointAddressDao.findAllWithAttributesAndPagination(attributes, page, limit)
        const resData = {
            data: addressList.rows,
            count: addressList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((addressList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "delivery address records successfully fetched");
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
const getDeliveryAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplierData = await deliveryPointAddressDao.findById(id);
        if (!supplierData) {
            return responseHelper.notFoundResponse(req, res, "delivery address Data not found!");
        }
        return responseHelper.successResponse(req, res, supplierData, "delivery address data successfully fetched");
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
const updateDeliveryAddress = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = req.body;
        delete updates.id;
        const addressData = await deliveryPointAddressDao.findById(id);
        if (!addressData) {
            return responseHelper.notFoundResponse(req, res, "Address Data not found!");
        }
        updates.updated_by = req.adminData.id;
        const [count, addressNewData] = await deliveryPointAddressDao.update(addressData.id, updates);
        return responseHelper.successResponse(req, res, addressNewData, "Address record successfully updated");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

/**
 * Soft Delete deliveryAddress.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deleteDeliveryAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const deliveryAddressData = await deliveryPointAddressDao.findById(id);
        if (!deliveryAddressData) {
            return responseHelper.notFoundResponse(req, res, "delivery Address Data not found!");
        }
        const deliveryAddressRes = await deliveryPointAddressDao.softDelete(deliveryAddressData.id);
        return responseHelper.successResponse(req, res, deliveryAddressRes, "delivery Address successfully deleted");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

module.exports = {
    createDeliveryAddress,
    getAllDeliveryAddress,
    getDeliveryAddressById,
    updateDeliveryAddress,
    deleteDeliveryAddress,
};
