const userDao = require('../user/userDao');
const userAddressDao = require("./userAddressDao");
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');
const { removeIsDefaultAddress } = require('../../helper/module_helper/common_utility');

/**
 * Create User Address.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const create = async (req, res) => {
    try {
        const { user_id } = req.body;
        const userData = await userDao.findById(user_id);
        if (!userData) {
            return responseHelper.notFoundResponse(req, res, 'User not found!');
        }
        const addressData = req.body;
        addressData.created_by = req.adminData.id;
        if (addressData.is_default === true) {
            await removeIsDefaultAddress(user_id);
        }
        const addressRes = await userAddressDao.create(addressData);
        return responseHelper.successResponse(req, res, addressRes, 'User Address successfully created.');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

/**
 * Get All UserAddress list.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllByUserId = async (req, res) => {
    try {
        const userId = req.query.id;
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const attributes = ['id', 'user_id', 'address_type', 'phone_number', 'street', 'landmark', 'city', 'state', 'zipcode', 'country']
        const addressList = await userAddressDao.findAndCountAll(userId, attributes, page, limit);
        const resData = {
            data: addressList.rows,
            count: addressList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((addressList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "User Addresss records successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

/**
 * Get UserAddresss details by Id.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const addressData = await userAddressDao.findById(id);
        if (!addressData) {
            return responseHelper.notFoundResponse(req, res, 'User Address not found!');
        }
        return responseHelper.successResponse(req, res, addressData, 'User Address successfully fetched.');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

/**
 * Update UserAddress details.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const update = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = req.body;
        delete updates.id;
        const addressData = await userAddressDao.findById(id);
        if (!addressData) {
            return responseHelper.notFoundResponse(req, res, 'User Address not found!');
        }
        delete updates.user_id;
        updates.updated_by = req.adminData.id;
        if (updates.is_default === true) {
            await removeIsDefaultAddress(user_id);
        }
        const [count, addressNewData] = await userAddressDao.update(addressData.id, updates);
        return responseHelper.successResponse(req, res, addressNewData, 'User Address successfully updated');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

/**
 * Soft Delete UserAddress.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const softDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const addressData = await userAddressDao.findById(id);
        if (!addressData) {
            return responseHelper.notFoundResponse(req, res, 'User address not found');
        }
        const addressRes = await userAddressDao.softDelete(addressData.id);
        return responseHelper.successResponse(req, res, addressRes, 'User address successfully deleted');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

module.exports = {
    create,
    getAllByUserId,
    getById,
    update,
    softDelete,
};
