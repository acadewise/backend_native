const userUnAvailabilityDao = require('../user_unavailability/userUnAvailabilityDao');
const userDao = require('../user/userDao');
const userAddressDao = require("./../user_address/userAddressDao");
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
const create = async (req, res) => {
    try {
       
        const user_id = req.userData.userId;
        const userData = await userDao.findById(user_id);
        if (!userData) {
            return responseHelper.notFoundResponse(req, res, 'User not found!');
        }
        const reqBody = req.body;
        const objArr    =   [];
        if(reqBody && reqBody.unavailable_dates && reqBody.unavailable_dates.length>0)
        {
            
            reqBody.unavailable_dates.map((item,index)=>{
                const dateObj   =   {};
                dateObj.unavailable_date=item;
                dateObj.customer_id=user_id;
                dateObj.address_id=reqBody.address_id;
                objArr.push(dateObj);
            })
        }
        
        
        const datesRes = await userUnAvailabilityDao.bulkCreate(objArr);
        return responseHelper.successResponse(req, res, datesRes, 'User dates successfully created.');
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
        const userId = req.userData.userId;
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const attributes = ['id', 'customer_id', 'address_id', 'unavailable_date']
        const Obj = { where: { customer_id:userId } }
        const addressList = await userUnAvailabilityDao.findAllWithAttributesAndPagination(attributes,userId, page, limit);
        console.log("addressList",addressList)
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
        const user_id = req.userData.userId;
        const Obj = {
            where: {
                id,
                user_id
            },
            attributes: ['id', 'user_id', 'address_type', 'is_default', 'phone_number', 'street', 'landmark', 'city', 'state', 'zipcode', 'country']
        }
        const addressData = await userAddressDao.findBy(Obj);
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
        const user_id = req.userData.userId;
        const Obj = { where: { id, user_id } }
        const addressData = await userAddressDao.findBy(Obj);
        if (!addressData) {
            return responseHelper.notFoundResponse(req, res, 'User Address not found!');
        }
        delete updates.id;
        delete updates.user_id;
        updates.updated_by = user_id;
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
        const user_id = req.userData.userId;
        const Obj = { where: { id, customer_id:user_id } }
        const datesRes = await userUnAvailabilityDao.findById(id);
       
        if (!datesRes) {
            return responseHelper.notFoundResponse(req, res, 'User dates not found');
        }
       
        const addressRes = await userUnAvailabilityDao.softDelete(datesRes.id);
        return responseHelper.successResponse(req, res, addressRes, 'User dates successfully deleted');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const createFirstAddress = async (req, res) => {
    try {
      const user_id = req.userData.userId;
      const userData = await userDao.findUserWithAddress(user_id);
      if (!userData) {
        return responseHelper.notFoundResponse(req, res, "User not found!");
      }
      if (isEmpty(userData.user_addresses)) {
          const addressData = req.body;
          addressData.user_id = user_id;
          addressData.created_by = user_id;
          addressData.is_default = false
          const addressRes = await userAddressDao.create(addressData);
      }
      return responseHelper.successResponse(
        req,
        res,
        '',
        "User Address successfully added."
      );
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
    createFirstAddress
};
