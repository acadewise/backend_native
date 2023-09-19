const systemSettingDao = require("./systemSettingDao");
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');

/**
 * Create supplier.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createSystemSetting = async (req, res) => {

    try {
        const { id, support_email, support_phone_number, banner_image, support_office_address } = req.body;
        const requestData = {
            id,
            support_email,
            support_phone_number,
            banner_image,
            support_office_address,
        };
        
        let resData=[];
        if(parseInt(id)>0){
            resData = await systemSettingDao.update(id,requestData);
        } else {
            resData = await systemSettingDao.create(requestData);
        }
        
        return responseHelper.successResponse(req, res, resData, "System setting successfully updated");
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
const getAllSettings = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };
        const addressList = await systemSettingDao.findAllWithAttributesAndPagination(attributes, page, limit)
        const resData = {
            data: addressList.rows,
            count: addressList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((addressList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "System setting successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}



module.exports = {
    createSystemSetting,
    getAllSettings,
    
};
