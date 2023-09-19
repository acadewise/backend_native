const UserProductWishlist = require('../../models').user_product_wishlist;
const ProductModel = require("../../models").products;
const ProductImage = require("../../models").product_image_videos;


/**
 * Get user product wishlist details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
    return UserProductWishlist.findOne({
        where: { id },
    });
}

/**
 * Get user product wishlist details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
    return UserProductWishlist.findAll(object);
}

/**
 * Find all the user product wishlist.
 */
function getUserWishlist(user_id, offset, limit) {
    return UserProductWishlist.findAndCountAll({
        where: { user_id, is_active: true },
        offset, limit,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
            {
                model: ProductModel,
                as: 'wishlist_product',
                required: true,
                attributes: ['id', 'name', 'description', 'is_on_sale', 'special_sale_price', 'max_retail_price'],
                include: [
                    {
                        model: ProductImage,
                        as: 'product_images',
                        required: false,
                        attributes: ['url'],
                        where: { is_active: true }
                    }
                ]
            }
        ]
    });
}

/**
 * Create user product wishlist.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function createWishlist(data) {
    return UserProductWishlist.create(data);
}

/**
 * Create user product wishlist.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function createOrUpdateWishlist(data) {
    return UserProductWishlist.findOne({
        where: {
            user_id: data.user_id,
            product_id: data.product_id
        }
    }).then(function (obj) {
        if (obj)
            return obj.update({ is_active: true });
        return UserProductWishlist.create(data);
    })
}

/**
 * Update user product wishlist.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function updateWishlist(id, data) {
    return UserProductWishlist.update(data, { where: { id }, returning: true });
}

/**
 * 
 * @param {*} id 
 * @returns 
 */
function softDeleteWishlist(id) {
    return UserProductWishlist.destroy({ where: { id } })
}

/**
 * 
 * @param {*} user_id 
 * @returns 
 */
function userWishlistProductCount(user_id) {
    return UserProductWishlist.count({
        where: { user_id, is_active: true },
        distinct: true
    });
}

module.exports = {
    findById,
    findBy,
    getUserWishlist,
    createOrUpdateWishlist,
    createWishlist,
    updateWishlist,
    softDeleteWishlist,
    userWishlistProductCount
}