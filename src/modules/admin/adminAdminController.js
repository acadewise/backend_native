const adminDao = require('./adminDao');
const DeliveryRouteAgent = require('./../delivery_route_agent/deliveryRouteAgentDao');
const { sendAdminRegistrationEmail } = require('../../utils/nodemailer');
const COMMON = require('../../constants/common');
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const CONFIG_CONST = require('../../config/configuration_constant');
const saltRounds = CONFIG_CONST.SALT_ROUND;


/**
 * Get all Admin user list.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getAllAdmins = async (req, res) => {
    try {
        console.log("req",req.query);
        const attributes = { exclude: [ 'updatedAt', 'deletedAt', 'password'] }
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        
        const adminList = await adminDao.findAllWithAttributesAndPagination(attributes, page, limit,req.query)
        const resData = {
            data: adminList.rows,
            count: adminList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((adminList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "Admin records successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Get Admin user detail by Id.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await adminDao.findById(id);
        if (!admin) {
            return responseHelper.notFoundResponse(req, res, 'Admin user not found');
        }
        const attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password'] };
        const adminData = await adminDao.findOneWithAttributes({ id: admin.id }, attributes);
        return responseHelper.successResponse(req, res, adminData, "Admin successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Create Admin user.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const createAdmin = async (req, res) => {
    try {

        let payload = req.body;
       
        //const password = COMMON.DEFAULT_PASS_BCRIPT;
        const hash = await bcrypt.hash(payload.password, saltRounds);
        payload.password = hash;
        const adminData = await adminDao.create(payload);

        if (payload && payload.delivery_route.length > 0) {
            let valData = payload.delivery_route.map((val) => {
                val.agent_id = adminData.id;
                return val;
            });
            const valRes = await DeliveryRouteAgent.bulkCreate(valData);
        }

        // Send email here for new registerd user
        const loginLink = `${process.env.APP_URL}/auth/login`
        // sendAdminRegistrationEmail(payload.email, loginLink);
        return responseHelper.successResponse(req, res, adminData, "Admin successfully created");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Update Admin user details.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const payload = req.body;
        delete payload.id;
        const admin = await adminDao.findById(id);
        if (!admin) {
            return responseHelper.notFoundResponse(req, res, 'Admin not found!');
        }

        if (payload && payload.password) {
            const hash = await bcrypt.hash(payload.password, saltRounds);
            payload.password = hash;
        }

        const [count, adminData] = await adminDao.update(admin.id, payload);
        if (payload && payload.delivery_route && payload.delivery_route.length > 0) {
            payload.delivery_route.map(async (val) => {
                let payloaddata = {
                    agent_id: admin.id,
                    route_id: parseInt(val.route_id)
                }
                if (val && parseInt(val.id) > 0 && val.is_deleted === false) {
                    await DeliveryRouteAgent.update(val.id, payloaddata)
                } else if (val.is_deleted === true) {
                    await DeliveryRouteAgent.softDelete(val.id)
                } else {
                    await DeliveryRouteAgent.create(payloaddata)
                }

                return val;
            });

        }
        return responseHelper.successResponse(req, res, adminData, "Admin successfully updated");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Switch admin user status to active & inactive.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const activeInactiveAdmin = async (req, res) => {
    try {
        const { status, id } = req.params
        const admin = await adminDao.findById(id);
        if (!admin) {
            return responseHelper.notFoundResponse(req, res, 'Admin not found');
        }
        let adminStatus = status === 'active' ? 1 : 0;
        const [count, adminData] = await adminDao.update(admin.id, { is_active: adminStatus });
        return responseHelper.successResponse(req, res, adminData, "Admin record successfully updated");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

module.exports = {
    getAllAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    activeInactiveAdmin
}
