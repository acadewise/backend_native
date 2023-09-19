const _ = require('lodash');
const productDao = require('./productDao');
const imageDao = require('../../image/imageDao');
const { sequelize } = require('../../../models/index');
const prodImgVidDao = require('../product_image_videos/productImageVideoDao');
const productHelper = require('../../../helper/module_helper/product_utility');
const { APP_PROD_SKU_PREFIX } = require('../../../config/configuration_constant.js');
const { getPageAndLimit, generateUniqueString,generateUniqueNumber } = require('../../../helper/helper_function');
const { internalServerError, successResponse, notFoundResponse, successResponseWithCount } = require('../../../helper/response_utility');

/**
 * Get all products list.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getAllProducts = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const productList = await productDao.getAllProductsWithRelationships(page, limit);
        const resData = {
            data: productList.rows,
            count: productList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((productList.count / limit))
        }
        return successResponseWithCount(req, res, resData, 'Product records successfully fetched.');
    } catch (error) {
        return internalServerError(req, res, error);
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
        const product = await productDao.findById(id);
        if (!product) {
            return notFoundResponse(req, res, 'Product not found!');
        }
        const productData = await productDao.findOneWithRelationships({ id: product.id });
        return successResponse(req, res, productData, "Product successfully fetched");
    } catch (error) {
        return internalServerError(req, res, error);
    }
}

/**
 * Create Product.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const createProduct = async (req, res) => {
    // transaction started
    const t = await sequelize.transaction();
    try {
        const ProductData = req.body;
        ProductData.sku = generateUniqueNumber(ProductData.name);
        ProductData.created_by = req.adminData.id;

        let checkUniqueData = await productDao.checkUniqueProductName(ProductData.name);
        if (checkUniqueData) {
            return notFoundResponse(req, res, 'Product name already in use.');
        }

        const product = await productDao.create(ProductData, t);
        let prodImages, prodCategory, prodTags, prodConfRule, prodAttr, prodAttrVal;
        if (ProductData.product_images && ProductData.product_images.length) {
            prodImages = await productHelper.addProductImages(product.id, ProductData.product_images, t);
        }
        if (ProductData.product_category && ProductData.product_category.length) {
            prodCategory = await productHelper.addProductCategories(product.id, ProductData.product_category, t);
        }
        if (ProductData.product_tags && ProductData.product_tags.length) {
            prodTags = await productHelper.addProductTags(product.id, ProductData.product_tags, t);
        }
        if (ProductData.product_configuration_rules && ProductData.product_configuration_rules.length) {
            prodConfRule = await productHelper.addProductConfigRules(product.id, ProductData.product_configuration_rules, t);
        }
        if (ProductData.product_attributes && ProductData.product_attributes.length) {
            prodAttr = await productHelper.addProductAttributes(product.id, ProductData.product_attributes, t);
            prodAttrVal = await productHelper.addProductAttributeValues(product.id, ProductData.product_attributes, t);
        }

        // transaction committed.
        await t.commit();
        return successResponse(req, res, product, "Product successfully created.");
    } catch (error) {
        // transaction rollback.
        await t.rollback();
        return internalServerError(req, res, error);
    }
}


/**
 * Update Product details.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateProduct = async (req, res) => {
    // start transaction.
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const productPayload = req.body;
        delete productPayload.id;
        delete productPayload.sku;
        const prodImg = productPayload.product_images;
        delete productPayload.product_images;
        const prodCat = productPayload.product_category;
        delete productPayload.product_category;
        const prodTag = productPayload.product_tags;
        delete productPayload.product_tags;
        const prodConfigRule = productPayload.product_configuration_rules;
        delete productPayload.product_configuration_rules;
        const prodAttr = productPayload.product_attributes;
        delete productPayload.product_attributes;

        const product = await productDao.findById(id);
        if (!product) {
            return notFoundResponse(req, res, 'Product not found!');
        }

        let checkUniqueData = await productDao.checkUniqueProductAttributeUpdate('name', productPayload.name, product.id);
        if (checkUniqueData) {
            return notFoundResponse(req, res, 'Product name already in use.');
        }

        productPayload.updated_by = req.adminData.id;

        const [count, productData] = await productDao.updateT(product.id, productPayload, t);
        if (prodImg && prodImg.length) {
            const prodImgData = await productHelper.updateProductImage(product.id, prodImg, t);
        }
        if (prodCat && prodCat.length) {
            const prodCatData = await productHelper.updateProductCategories(product.id, prodCat, t);
        }
        if (prodTag && prodTag.length) {
            const prodTagData = await productHelper.updateProductTags(product.id, prodTag, t);
        }
        if (prodConfigRule && prodConfigRule.length) {
            const prodConfRuleData = await productHelper.updateProdConfigRule(product.id, prodConfigRule, t);
        }
        if (prodAttr && prodAttr.length) {
            const prodAttrData = await productHelper.updateProductAttributes(product.id, prodAttr, t);
        }
        // commit transaction.
        await t.commit();
        return successResponse(req, res, productData, "Product successfully updated.");
    } catch (error) {
        // transaction rollback.
        await t.rollback();
        return internalServerError(req, res, error);
    }
}

/**
 * Soft delete product.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const deleteProduct = async (req, res) => {
    // start transaction.
    const t = await sequelize.transaction();
    try {
        const { id } = req.params
        const product = await productDao.findById(id);
        if (!product) {
            return notFoundResponse(req, res, 'Product not found!');
        }

        const deletedData = await productHelper.disableProduct(product.id, t);
        // await productHelper.disableProductImages(product.id, t);
        // await productHelper.disableProductCategories(product.id, t);
        // await productHelper.disableProductTags(product.id, t);
        // await productHelper.disableProductAttributes(product.id, t);
        // await productHelper.disableProductConfRule(product.id, t);
        // await productHelper.disableProductAttributeValues(product.id, t);

        // commit transaction.
        await t.commit();
        return successResponse(req, res, deletedData, "Product successfully disabled.");
    } catch (error) {
        // rollback transaction.
        await t.rollback();
        return internalServerError(req, res, error);
    }
}

/**
 * Search product by name and sku.
 * @param {*} req 
 * @param {*} res 
 */
const searchProduct = async (req, res) => {
    try {
        let query = req.query.searchQuery;
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        query = "%" + query + "%";
        const result = await productDao.searchWithRelation(query, limit, page);
        if (!result) {
            return notFoundResponse(req, res, 'No product found!');
        }
        const resData = {
            data: result.rows,
            count: result.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((result.count / limit))
        }
        return successResponseWithCount(req, res, resData, 'products are successfully fetched.');
    } catch (error) {
        return internalServerError(req, res, error);
    }
}

/**
 * Remove image from product.
 * @param {*} req 
 * @param {*} res 
 */
const removeProductImage = async (req, res) => {
    // start transaction.
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const productImage = await prodImgVidDao.findAnyById(id);
        if (!productImage) {
            return notFoundResponse(req, res, 'Product image not found!');
        }
        const rmProdImg = await prodImgVidDao.softDeleteT(id, t);
        const image = await imageDao.findByUrl(productImage.url);
        if (image) {
            const rmImage = await imageDao.hardDeleteT(image.id);
        }
        // commit transaction.
        await t.commit();
        return successResponse(req, res, rmProdImg, 'Image successfully deleted.')

    } catch (error) {
        // rollback transaction.
        await t.rollback();
        return internalServerError(req, res, error);
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
    removeProductImage
}
