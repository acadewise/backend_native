const userDao = require('../user/userDao');
const Common = require('../../constants/admin');
const { Language } = require('../../constants/api');
const { uploadImage } = require('../../helper/file_handler');
const responseHelper = require('../../helper/response_utility');
const { getS3FolderName } = require('../../helper/helper_function');
const { IMAGE_QUALITY } = require('../../config/configuration_constant');
const orderPaymentHistoryDao = require("./../orders/orderPaymentHistory/orderPaymentHistoryDao");

/**
 * verify User token
 * @param {*} req
 * @param {*} res
 * @returns
*/
async function VerifyUserToken(req, res) {
    try {
        const userId = req.userData.userId;
        const user = await userDao.findByIdAssociateLanguage(userId);
        if (user) {
            const userObject = {
                id: user.id,
                phone_number: user.phone_number,
                is_phone_verified: user.is_phone_verified,
                last_login: user.last_login,
                user_language: user.user_language
            }
            return responseHelper.successResponse(req, res, userObject, "User verified.");
        } else {
            return responseHelper.notFoundResponse(req, res, "User not found!");
        }

    } catch (error) {
        return responseHelper.internalServerError(req, res, error)
    }

}


/**
 * update language
 * @param {*} req
 * @param {*} res
 */
const updateLanguage = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const isUser = await userDao.findByIdAssociateLanguage(userId);
        const updateData = req.body;
        if (userId && updateData && isUser) {
            const [row, user] = await userDao.update(userId, updateData);
            user[0].setDataValue('user_language', isUser.user_language);
            return responseHelper.successResponse(req, res, user[0], Language.LANGUAGE_SUCC_UPDATE)
        }
    } catch (error) {
        return responseHelper.internalServerError(req, res, error)
    }
}

/**
 * Get User Profile Detail.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getUserProfileDetail = async (req, res) => {
    try {
        const id = req.userData.userId;
        const attributes = {
            exclude: [
                'password', 'phone_verification_token', 'email_verification_token',
                'fcmToken', 'system_properties', 'createdAt', 'updatedAt', 'deletedAt'
            ]
        };
        const userData = await userDao.findOneWithAttributes({ id }, attributes);
        if (!userData) {
            return responseHelper.notFoundResponse(req, res, 'User not found!');
        }
        return responseHelper.successResponse(req, res, userData, "User data successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const updateUserProfile = async (req, res) => {
    try {
        const id = req.userData.userId;
        const user = await userDao.findById(id);
        if (!user) {
            return responseHelper.notFoundResponse(req, res, 'User not found!');
        }
        const { name, email, dob, gender, language_id } = req.body;
        const image = req.file;
        let avatarData, profile_picture;
        if (image) {
            const folder = getS3FolderName('profile_image');
            avatarData = await uploadImage(image, folder, IMAGE_QUALITY);
            if (!avatarData) {
                return responseHelper.badReqResponse(req, res, Common.IMAGE_UPD_ERR);
            }
            profile_picture = avatarData.Location;
        }
        const upObj = { name, email, dob, gender, profile_picture, language_id };
        const [count, userData] = await userDao.update(user.id, upObj);
        return responseHelper.successResponse(req, res, {}, "User profile successfully updated.");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

const checkSinglePaymentHistory = async (req, res) => {
    try {
        const query = {
            customer_id: req && req.query && req.query.customer_id || ''
        }
        if (!query.customer_id) {
            return responseHelper.notFoundResponse(req, res, 'User not found!');
        }
        const user = await userDao.findById(query.customer_id);
        if (!user) {
            return responseHelper.notFoundResponse(req, res, 'User not found!');
        }
        const totalCreditAmount = await orderPaymentHistoryDao.totalCreditAmount(query);
        const totalDebitAmount = await orderPaymentHistoryDao.totalDebitAmount(query);
        let data = { ...totalCreditAmount[0], ...totalDebitAmount[0] };


        return responseHelper.successResponse(req, res, data, "Fetched successfully.");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

module.exports = {
    updateLanguage,
    VerifyUserToken,
    getUserProfileDetail,
    updateUserProfile,
    checkSinglePaymentHistory
}