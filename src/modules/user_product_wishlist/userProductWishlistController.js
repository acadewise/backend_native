const responseHelper = require('../../helper/response_utility');
const userProductWishlistDao = require('./userProductWishlistDao');
const { getPageAndLimit } = require('../../helper/helper_function');
const { MAX_WISHLIST_PRODUCT_COUNT } = require('../../config/configuration_constant');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const addProductToWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userData.userId;
        const wishlistCount = await userProductWishlistDao.userWishlistProductCount(userId);
        if (wishlistCount >= MAX_WISHLIST_PRODUCT_COUNT) {
            return responseHelper.badReqResponse(req, res, `Maximum ${MAX_WISHLIST_PRODUCT_COUNT} products can be added to wishlist!`);
        }
        const createObj = {
            user_id: req.userData.userId,
            product_id: id
        }
        const wishlist = await userProductWishlistDao.createOrUpdateWishlist(createObj);
        return responseHelper.successResponse(req, res, wishlist, "Product successfully added to wishlist.");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getUserWishlist = async (req, res) => {
    try {
        const user_id = req.userData.userId;
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const wishlist = await userProductWishlistDao.getUserWishlist(user_id, page, limit)
        const resData = {
            data: wishlist.rows,
            count: wishlist.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((wishlist.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "Wishlist successfully fetched.");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const removeProductFromWishlist = async (req, res) => {
    try {
        const { id } = req.params
        const wishlist = await userProductWishlistDao.findById(id);
        if (!wishlist) {
            return responseHelper.notFoundResponse(req, res, 'Product not found in wishlist!');
        }
        const upObj = {
            is_active: false
        }
        const deletedData = await userProductWishlistDao.updateWishlist(wishlist.id, upObj);
        return responseHelper.successResponse(req, res, deletedData, "Product successfully removed from wishlist.");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

module.exports = {
    addProductToWishlist,
    getUserWishlist,
    removeProductFromWishlist
}