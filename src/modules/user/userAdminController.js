const userDao = require('./userDao');
const userAddressDao = require('../user_address/userAddressDao');
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');

/**
 * Get list of all users.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllUsers = async (req, res) => {
    try {
        const attributes = { exclude: ['password', 'updatedAt'] };
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const usersList = await userDao.findAllWithAttributesAndPagination(attributes, page, limit,req.query);
        const resData = {
            data: usersList.rows,
            count: usersList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((usersList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "Users records successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Get user details by Id.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userDao.findById(id);
        if (!user) {
            return responseHelper.notFoundResponse(req, res, 'User not found');
        }
        const attributes = { exclude: ['password', 'updatedAt'] };
        const userData = await userDao.findOneWithAttributes({ id: user.id }, attributes);
        return responseHelper.successResponse(req, res, userData, "User status successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Update user details.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updateUser = async (req, res) => {

    try {
        const userId = req.adminData.id;
        const { id } = req.params;
        let updates = req.body;
        delete updates.id;

       

        const user = await userDao.findById(id);
        if (!user) {
            return responseHelper.notFoundResponse(req, res, 'User not found');
        }

        let checkUniqueEmail = await userDao.checkUniqueUserAttributeUpdate('email', updates.email,user.id)
        if (checkUniqueEmail) {
            return responseHelper.notFoundResponse(req, res, 'Email is already in use.');
        }
        let checkUniquePhone = await userDao.checkUniqueUserAttributeUpdate('phone_number', updates.phone_number,user.id)
        if (checkUniquePhone) {
            return responseHelper.notFoundResponse(req, res, 'Phone Number is already in use.');
        }

        const [count, userData] = await userDao.update(user.id, updates);
        // save user Addresses
        const userAddresses = updates.addresses.map(async(obj) => {

            let updateAddress = await userAddressDao.update(obj.id, obj);
            return obj;
        });

        

        return responseHelper.successResponse(req, res, userData, "User record successfully updated");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Update user status to active & inactive.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const activeInactiveUser = async (req, res) => {
    try {
        const { status, id } = req.params
        const user = await userDao.findById(id);
        if (!user) {
            return responseHelper.notFoundResponse(req, res, 'User not found');
        }
        let userStatus = status === 'active' ? 1 : 0;
        const [count, userData] = await userDao.update(user.id, { active: userStatus });

        return responseHelper.successResponse(req, res, userData, "User record successfully updated");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Search user by email, phone number and name.
 * @param {*} req 
 * @param {*} res 
 */
const searchUser = async (req, res) => {
    try {
        let query = req.query.searchQuery;
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const attributes = ['id', 'name', 'email', 'phone_number'];
        query = "%" + query + "%";
        const result = await userDao.searchUserWithAddress(query, attributes, limit, page);
        if (!result) {
            return responseHelper.notFoundResponse(req, res, 'No users found!');
        }
        const resData = {
            data: result.rows,
            count: result.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((result.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, 'Users are successfully fetched.');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Create user.
 * @param {*} req 
 * @param {*} res 
 * @method createUser
 * @returns 
 */
const createUser = async (req, res) => {
    try {
        let userPayload = req.body;
        const userId = req.adminData.id;

        let checkUniqueEmail = await userDao.checkUniqueUserAttribute('email', userPayload.email)
        if (checkUniqueEmail) {
            return responseHelper.notFoundResponse(req, res, 'Email already in use.');
        }
        let checkUniquePhone = await userDao.checkUniqueUserAttribute('phone_number', userPayload.phone_number)
        if (checkUniquePhone) {
            return responseHelper.notFoundResponse(req, res, 'Phone Number already in use.');
        }
        // Create user
        const user = await userDao.create(userPayload);
        // save user Addresses
        const userAddresses = userPayload.addresses.map(obj => {
            obj.user_id = user.id
            obj.created_by = userId
            return obj;
        });
        const userAddressData = await userAddressDao.bulkCreate(userAddresses);
        user.setDataValue('user_address', userAddressData);
        return responseHelper.successResponse(req, res, user, "User record successfully updated");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error)
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    activeInactiveUser,
    createUser,
    searchUser
}
