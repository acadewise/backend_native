const couponMasterDao = require("./couponMasterDao");
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');

/**
 * Create supplier.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createCouponMaster = async (req, res) => {

    try {
        const { coupon_code, coupon_title, coupon_description, coupon_type, coupon_quantity, used_coupon_quantity, coupon_amount, from_date, to_date,
            coupon_status,
            min_order_amount,
            user_type,
            coupen_uses_type } = req.body;
        const requestData = {
            coupon_code,
            coupon_title,
            coupon_description,
            coupon_type,
            coupon_quantity,
            used_coupon_quantity,
            coupon_amount,
            from_date,
            to_date,
            coupon_status,
            min_order_amount,
            user_type,
            coupen_uses_type,
        };
        const resData = await couponMasterDao.create(requestData);
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
const getAllCouponMaster = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };
        const addressList = await couponMasterDao.findAllWithAttributesAndPagination(attributes, page, limit)
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
const getCouponMasterById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplierData = await couponMasterDao.findById(id);
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
const updateCouponMaster = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = req.body;
        delete updates.id;
        const routeData = await couponMasterDao.findById(id);
        if (!routeData) {
            return responseHelper.notFoundResponse(req, res, "Route Data not found!");
        }
        updates.updated_by = req.adminData.id;
        const [count, routeNewData] = await couponMasterDao.update(routeData.id, updates);
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
const deleteCouponMaster = async (req, res) => {
    try {
        const { id } = req.params;
        const routeData = await couponMasterDao.findById(id);
        if (!routeData) {
            return responseHelper.notFoundResponse(req, res, "route Data not found!");
        }
        const routeRes = await couponMasterDao.softDelete(routeData.id);
        return responseHelper.successResponse(req, res, routeRes, "route successfully deleted");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

module.exports = {
    createCouponMaster,
    getAllCouponMaster,
    getCouponMasterById,
    updateCouponMaster,
    deleteCouponMaster,
};
