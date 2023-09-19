const userUnAvailabilityDao = require('./userUnAvailabilityDao');
const userDao = require('../user/userDao');
const userAddressDao = require("../user_address/userAddressDao");
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');
const { removeIsDefaultAddress } = require('../../helper/module_helper/common_utility');
const { isEmpty } = require('lodash');

/**
 * Create User Address.
 * @param {*} req
 * @param {*} res
 * @returns
 */


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
        const attributes = ['id', 'customer_id', 'address_id', 'unavailable_date']
        const Obj = { where: { customer_id:userId } }
        const addressList = await userUnAvailabilityDao.findAllWithAttributesAndPagination(attributes,userId, page, limit);
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


module.exports = {
    getAllByUserId,
};
