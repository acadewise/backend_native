const crypto = require("crypto");
const bcrypt = require('bcrypt');
const { Admin } = require('../../constants/admin');
const adminDao = require('../admin/adminDao');
const passwordResetDao = require('../password_reset/passwordResetDao');
const { sendResetPasswordEmail } = require('../../utils/nodemailer');
const { createAdminToken } = require('../../middlewares/token_manager');
const CONFIG_CONST = require('../../config/configuration_constant');
const saltRounds = CONFIG_CONST.SALT_ROUND;
const responseHelper = require('../../helper/response_utility');

/**
 * Login to Admin.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminDao.findByEmailId(email);
        if (!admin) {
            return responseHelper.badReqResponse(req, res, Admin.EMAIL_NOT_EXISTS);
        }
        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            return responseHelper.badReqResponse(req, res, Admin.INCORRECT_PASS);
        }
        const token = await createAdminToken(admin);
        return responseHelper.successResponseToken(req, res, admin, token, Admin.SUCC_LOGIN);
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Send Admin reset password link via email.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const sendForgotPasswordLink = async (req, res) => {
    try {
        const resData = {};
        const { email } = req.body;
        const admin = await adminDao.findByEmailId(email);
        if (!admin) {
            return responseHelper.badReqResponse(req, res, Admin.EMAIL_NOT_EXISTS);
        }
        let token = await passwordResetDao.findOne({ admin_id: admin.id });
        if (!token) {
            const tokenObj = {
                admin_id: admin.id,
                token: crypto.randomBytes(32).toString("hex")
            }
            token = await passwordResetDao.create(tokenObj);
        }
        const link = `${process.env.APP_URL}/auth/reset-password/${admin.id}/${token.token}`;
        await sendResetPasswordEmail(admin.email, link);
        return responseHelper.successResponse(req, res, resData, Admin.PASSWORD_SENT_ON_EMAIL);
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Reset password using email link.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const resetPassword = async (req, res) => {
    try {
        const resData = {};
        const { password } = req.body;
        const admin = await adminDao.findById(req.params.adminId);
        if (!admin) {
            return responseHelper.badReqResponse(req, res, Admin.LINK_EXPIRE);
        }
        const token = await passwordResetDao.findOne({
            admin_id: admin.id,
            token: req.params.token,
        });
        if (!token) {
            return responseHelper.badReqResponse(req, res, Admin.LINK_EXPIRE);
        }
        const hash = await bcrypt.hash(password, saltRounds);
        await adminDao.update(admin.id, { password: hash });
        await passwordResetDao.hardDeleteById(token.id);
        return responseHelper.successResponse(req, res, resData, Admin.PASS_SUCC_RESET);
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

module.exports = {
    login,
    sendForgotPasswordLink,
    resetPassword
}
