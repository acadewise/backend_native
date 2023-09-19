const _ = require('lodash');
const { searchWithName } = require('./productDao');
const Attribute = require('../../../models').attributes;
const productModel = require('../../../models').products;
const ImgVideos = require('../../../models').product_image_videos;
const AttributeValue = require('../../../models').attribute_values;
const responseHelper = require('../../../helper/response_utility');
const { getPageAndLimit } = require('../../../helper/helper_function');
const productUtility = require('../../../helper/module_helper/product_utility');
const { ORDER_BEFORE_HOURS } = require('../../../config/configuration_constant');

/**
* Get all categories List.
* @param {*} req
* @param {*} res
* @returns
*/
const getAllProducts = async (req, res) => {
    try {
        // Pagination
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);

        // Attributes
        const attributes = {
            exclude: ['createdAt', 'updatedAt', 'deletedAt', 'created_by', 'updated_by', 'deleted_by', 'is_variations', "is_variations",
                "is_searchable",
                "is_show_on_list",
                "is_featured",
                "show_on_web",
                "add_ons",
                "tax"]
        }
        // Service Calling
        const { status, data, error } = await productUtility.getAllWebProducts(page, limit, attributes);
        return responseHelper.apiResponseSuccessList(req, res, status, data, error, limit, originalPageValue, 'products are successfully fetched.');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error)
    }
}

/**
 * Get production details by Id.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const { zip_code } = req.query;
        const userId = null;
        const attributes = {
            exclude: ['product_cost_price', 'createdAt', 'updatedAt', 'deletedAt', 'created_by', 'updated_by', 'deleted_by', 'is_variations', "is_variations",
                "is_searchable",
                "is_show_on_list",
                "is_featured",
                "show_on_web",
                "add_ons",
                "tax"]
        }
        const { status, data, error } = await productUtility.getWebProductById(id, attributes, zip_code, userId);
        if (_.isEmpty(data)) {
            return responseHelper.notFoundResponse(req, res, error);
        }
        userId == null ? data.setDataValue('user_wishlist', null) : '';
        data.setDataValue('allowed_order_before_hours', ORDER_BEFORE_HOURS);
        return responseHelper.apiResponseSuccess(req, res, status, data, error, "Product detail successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Get Category Products.
 * @param {*} req 
 * @param {*} res 
 */
const getCategoryProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const attributes = {
            exclude: ['product_cost_price', 'createdAt', 'updatedAt', 'deletedAt', 'created_by',
                'updated_by', 'deleted_by', 'add_ons', 'tax']
        }
        const customObj = {
            where: { category_id: id, is_active: true },
            include: [
                {
                    model: productModel,
                    as: 'category_product',
                    attributes,
                    where: { is_active: true,show_on_web:true },
                    include: [
                        {
                            model: ImgVideos,
                            as: 'product_images',
                            required: false,
                            attributes: ['id', 'product_id', 'type', 'url', 'position', 'is_active']
                        },
                        {
                            model: Attribute,
                            as: 'prod_attributes',
                            required: false,
                            attributes: ['id', 'name', 'slug', 'image', 'order', 'is_default'],
                            through: {
                                where: {
                                    // product_id: object.id,
                                    is_active: true
                                }
                            },
                            include: [
                                {
                                    model: AttributeValue,
                                    as: 'prod_attr_values',
                                    required: false,
                                    attributes: ['id', 'attribute_id', 'label', 'value', 'image', 'order', 'is_default', 'is_active'],
                                    through: {
                                        attributes: ['id', 'product_id'],
                                        where: {
                                            // product_id: object.id,
                                            is_active: true
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],
            offset: page, limit
        };
        const { status, data, error } = await productUtility.getCategoryProducts(customObj);
        return responseHelper.apiResponseSuccessList(req, res, status, data, error, limit, originalPageValue, 'products are successfully fetched.');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Search product by name and sku.
 * @param {*} req 
 * @param {*} res 
 */
const searchProduct = async (req, res) => {
    try {
        let query = req.query.searchQuery.toLowerCase();
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const result = await searchWithName(query, limit, page);
        if (!result) {
            return responseHelper.notFoundResponse(req, res, 'No product found!');
        }
        const resData = {
            data: result.rows,
            count: result.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((result.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, 'products are successfully fetched.');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    getCategoryProducts,
    searchProduct
}