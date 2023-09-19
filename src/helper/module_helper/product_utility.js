
const _ = require('lodash');
const { StatusCodes } = require('http-status-codes');
const { validateRouteAgainstProduct } = require('../helper_function');
const itemTagDao = require('../../modules/item_tags/itemTagDao');
const { PRODUCT_QUANTITY_ADD, STOCK_STATUS } = require('../../constants/common');
const inventoryDao = require('../../modules/inventory/inventoryDao');
const productDao = require('../../modules/product/product/productDao');
const productCategoryDao = require('../../modules/product/product_category/productCategoryDao');
const prodImgVidDao = require('../../modules/product/product_image_videos/productImageVideoDao');
const productAttributeDao = require('../../modules/product/product_attributes/productAttributeDao');
const prodConfigRuleDao = require('../../modules/product/product_config_rule/productConfigRuleDao');
const prodAttrValueDao = require('../../modules/product/product_attribute_value/productAttributeValueDao');
const moment = require('moment');


/**
 * Add and map product images.
 * @param {*} product_id 
 * @param {*} images 
 */
const addProductImages = async (product_id, images, t) => {
    try {
        const prodImg = images.map((img, index) => {
            return {
                product_id,
                type: img.type,
                url: img.url,
                position: img.position || index,
                is_active: true
            }
        });
        const imgProd = await prodImgVidDao.bulkCreateT(prodImg, t);
        return imgProd;
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Add and Map product Categories.
 * @param {*} productId 
 * @param {*} categories 
 * @returns 
 */
const addProductCategories = async (product_id, categories, t) => {
    try {
        const prodCat = categories.map((cat) => {
            return {
                category_id: cat,
                product_id
            }
        });
        const catProd = await productCategoryDao.bulkCreatePCT(prodCat, t);
        return catProd;
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Add and Map product Tags.
 * @param {*} productId 
 * @param {*} tags 
 * @returns 
 */
const addProductTags = async (productId, tags, t) => {
    try {
        const prodTag = tags.map((tag) => {
            return {
                item_type: 1,
                item_id: productId,
                tag_id: tag
            }
        });
        const prodTags = await itemTagDao.bulkCreateITT(prodTag, t);
        return prodTags;
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Add product configuration rules.
 * @param {*} product_id 
 * @param {*} configRules 
 * @returns 
 */
const addProductConfigRules = async (product_id, configRules, t) => {
    try {
        const prodRule = configRules.map((cat) => {
            return {
                rule_id: cat,
                product_id
            }
        });
        const catProd = await prodConfigRuleDao.bulkCreateT(prodRule, t);
        return catProd;
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Add and Map product Attributes.
 * @param {*} productId 
 * @param {*} attributes 
 * @returns 
 */
const addProductAttributes = async (product_id, attributes, t) => {
    try {
        const prodAttr = attributes.map((attr) => {
            return {
                product_id,
                attribute_id: attr.attribute_id
            }
        })
        const prodAttrs = await productAttributeDao.bulkCreatePAT(prodAttr, t);
        return prodAttrs;
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * add Product Attribute Values.
 * @param {*} productId 
 * @param {*} attributeId 
 * @returns
 */
const addProductAttributeValues = async (productId, attributes, t) => {
    try {
        const attrIds = attributes.map((x) => x.attribute_id);
        const prodAttr = await productAttributeDao.getProdAttribute(productId, attrIds, t);
        let attrValueRes;
        if (prodAttr) {
            let attributeValueData = [];
            attributes.forEach((x) => {
                prodAttr.forEach((y) => {
                    if (x.attribute_id == y.attribute_id) {
                        x.values.forEach((z) => {
                            attributeValueData.push(
                                {
                                    product_id: y.product_id,
                                    // p_attribute_id: y.id,
                                    attribute_id: y.attribute_id,
                                    attribute_value_id: z
                                }
                            )
                        });
                    }
                });
            });
            attrValueRes = await prodAttrValueDao.bulkCreatePAVT(attributeValueData, t);
        }
        return attrValueRes;
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Disable product.
 * @param {*} id 
 * @returns
 */
const disableProduct = async (id, t) => {
    try {
        const obj = { is_active: false };
        const product = await productDao.updateT(id, obj, t);
        return product;
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Disable product Images.
 * @param {*} product_id 
 * @returns
 */
const disableProductImages = async (product_id, t) => {
    try {
        const prodImg = await prodImgVidDao.disablebyProductIdT(product_id, t);
        return prodImg;
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Disable product categories.
 * @param {*} product_id 
 * @returns
 */
const disableProductCategories = async (product_id, t) => {
    try {
        const prodCat = await productCategoryDao.disableProductCategoryT(product_id, t);
        return prodCat;
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Disable product tags.
 * @param {*} product_id 
 * @returns
 */
const disableProductTags = async (product_id, t) => {
    try {
        const prodTags = await itemTagDao.disableItemTagsT(product_id, t);
        return prodTags;
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Disable product configuration rules.
 * @param {*} product_id 
 * @returns 
 */
const disableProductConfRule = async (product_id, t) => {
    try {
        const prodTags = await prodConfigRuleDao.disableT(product_id, t);
        return prodTags;
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Disable product Attributes.
 * @param {*} product_id 
 * @returns
 */
const disableProductAttributes = async (product_id, t) => {
    try {
        const prodAttr = await productAttributeDao.disableProductAttributesT(product_id, t);
        return prodAttr;
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Disable product Attribute Values.
 * @param {*} product_id 
 * @returns
 */
const disableProductAttributeValues = async (product_id, t) => {
    try {
        const prodAttrVal = await prodAttrValueDao.disableProductAttributeValuesT(product_id, t);
        return prodAttrVal;
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * 
 * @param {*} product_id 
 * @param {*} ProdImage 
 * @param {*} t 
 */
const updateProductImage = async (product_id, ProdImage, t) => {
    try {
        const res = [];
        const addImages = ProdImage.filter(x => x.id == undefined || x.id == null);
        const updImages = ProdImage.filter(x => x.id != undefined || x.id != null);
        if (addImages.length) {
            const add = await addProductImages(product_id, addImages, t);
            res.push(add);
        }
        for (let upd of updImages) {
            const upObj = {
                position: upd.position,
                is_active: upd.is_active === undefined ? true : upd.is_active
            }
            const [count, update] = await prodImgVidDao.updateT(upd.id, upObj, t);
            res.push(update);
        }
        return res;
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Update Product Categories.
 * @param {*} product_id
 * @param {*} prodCategory
 * @param {*} t
 * @returns
 */
const updateProductCategories = async (product_id, ProdCategory, t) => {
    try {
        let res = [];
        for (let pd of ProdCategory) {
            const pdCat = await productCategoryDao.getProdCatByPidAndCid(product_id, pd.category_id, t);
            if (pdCat) {
                const updateObj = {
                    is_active: pd.is_active === undefined ? true : pd.is_active
                }
                const [count, update] = await productCategoryDao.updateProductCategory(pdCat.id, updateObj, t);
                res.push(update);
            } else {
                if (pd.category_id) {
                    const data = {
                        category_id: pd.category_id,
                        product_id
                    }
                    const prodCatData = await productCategoryDao.createProductCategory(data, t);
                    res.push(prodCatData);
                }
            }
        }
        return res;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}

/**
 * Update Product Tags.
 * @param {*} product_id
 * @param {*} ProdTags
 * @param {*} t
 * @returns
 */
const updateProductTags = async (product_id, ProdTags, t) => {
    try {
        let res = [];
        for (let pt of ProdTags) {
            const prodTag = await itemTagDao.getItemTagByIidAndTid(product_id, pt.tag_id, t);
            if (prodTag) {
                const upData = {
                    is_active: pt.is_active === undefined ? true : pt.is_active
                };
                const [count, update] = await itemTagDao.updateItemTags(prodTag.id, upData, t);
                res.push(update);
            } else {
                if (pt.tag_id) {
                    const data = {
                        item_id: product_id,
                        item_type: 1,
                        tag_id: pt.tag_id
                    }
                    const prodTagData = await itemTagDao.createItemTag(data, t);
                    res.push(prodTagData);
                }
            }
        }
        return res;
    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Update product configuration rules.
 * @param {*} product_id 
 * @param {*} configRule 
 * @param {*} t
 */
const updateProdConfigRule = async (product_id, configRule, t) => {
    try {
        let res = [];
        for (let cr of configRule) {
            const confRule = await prodConfigRuleDao.getByRidAndPid(cr.rule_id, product_id, t);
            if (confRule) {
                const upData = {
                    is_active: cr.is_active === undefined ? true : cr.is_active
                };
                const [count, update] = await prodConfigRuleDao.updateT(confRule.id, upData, t);
                res.push(update);
            } else {
                if (cr.rule_id) {
                    const data = {
                        rule_id: cr.rule_id,
                        product_id
                    }
                    const confRuleData = await prodConfigRuleDao.createT(data, t);
                    res.push(confRuleData);
                }
            }
        }
        return res;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}

/**
 * 
 * @param {*} product_id 
 * @param {*} AttrData 
 * @param {*} t 
 * @returns 
 */
const updateProductAttributes = async (product_id, AttrData, t) => {
    try {
        const res = [];
        for (let ad of AttrData) {
            const attrData = await productAttributeDao.getProdAttributeByPIDAID(product_id, ad.attribute_id, t);
            if (attrData) {
                const checkAttrAndVal = await checkUpdateProductAttributeAndValues(product_id, ad, attrData, t);
                res.push(checkAttrAndVal);
            } else {
                if (ad.attribute_id) {
                    const atrObj = {
                        product_id,
                        attribute_id: ad.attribute_id,
                        is_active: ad.is_active === undefined ? true : ad.is_active
                    }
                    const creAttr = await productAttributeDao.createProductAttributes(atrObj, t);
                    if (ad.values && ad.values.length) {
                        let arrVal = [];
                        for (let val of ad.values) {
                            if (val) {
                                arrVal.push({
                                    product_id,
                                    attribute_id: ad.attribute_id,
                                    attribute_value_id: val,
                                    is_active: true
                                });
                            }
                        }
                        if (arrVal.length) {
                            const creAttVal = await prodAttrValueDao.bulkCreateProdAttrValue(arrVal, t);
                        }
                    }
                    res.push(creAttr);
                }
            }
        }
        return res;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}

/**
 * Support function for add & update attribute and attribute values.
 * @param {*} product_id 
 * @param {*} ad 
 * @param {*} t 
 */
const checkUpdateProductAttributeAndValues = async (product_id, ad, attrData, t) => {
    try {
        const res = [];
        if (ad.is_active != undefined) {
            const upObj = {
                is_active: ad.is_active
            };
            const [count, update] = await productAttributeDao.updateProdAttribute(attrData.id, upObj, t);
            if (ad.is_active === false) {
                await prodAttrValueDao.updateProdAttrValueByPIDAID(product_id, attrData.attribute_id, upObj, t);
            }
            res.push(update);
        }
        if (ad.values && ad.values.length && ad.is_active != false) {
            const newDataVal = ad.values;
            const oldValues = attrData.prod_attr_values.map(x => {
                return {
                    attribute_value_id: x.attribute_value_id,
                    is_active: x.is_active
                }
            });
            const rmValues = oldValues.filter(x => newDataVal.indexOf(x.attribute_value_id) == -1).map(x => x.attribute_value_id);
            const addValuesFilter = oldValues.filter(x => x.is_active === true).map(x => x.attribute_value_id);
            const addValues = newDataVal.filter(x => addValuesFilter.indexOf(x) == -1);
            if (rmValues.length > 0) {
                const upObj = { is_active: false };
                const [count, removeData] = await prodAttrValueDao.updateProdAttrValueByPIDAIDAVID(product_id, attrData.attribute_id, rmValues, upObj, t);
            }
            if (addValues.length > 0) {
                const addObj = [];
                for (let addV of addValues) {
                    const checkAdd = await prodAttrValueDao.getProdAttrValByPidAndAidAndAvid(product_id, ad.attribute_id, addV);
                    if (checkAdd) {
                        const chObj = { is_active: true };
                        const checkData = await prodAttrValueDao.updateProdAttrValue(checkAdd.id, chObj, t);
                    } else {
                        addObj.push({
                            product_id,
                            attribute_id: ad.attribute_id,
                            attribute_value_id: addV,
                            is_active: true
                        });
                    }
                }
                if (addObj.length > 0) {
                    const newAttVal = await prodAttrValueDao.bulkCreatePAVT(addObj, t);
                    res.push(newAttVal);
                }
            }
        }
        return res;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}

/**
 * Get all categories List.
 * @param {*} req 
 * @param {*} res 
 * @method getAllProducts
 * @returns 
 */
const getAllProducts = async (page, limit, attributes = []) => {
    try {
        const productList = await productDao.findAllWithAttributesAndPagination(attributes, page, limit)
        return {
            status: StatusCodes.OK,
            data: productList,
            error: null
        }
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            data: null,
            error
        }
    }
}
const getAllWebProducts = async (page, limit, attributes = []) => {
    try {
        const productList = await productDao.findWebAllWithAttributesAndPagination(attributes, page, limit)
        return {
            status: StatusCodes.OK,
            data: productList,
            error: null
        }
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            data: null,
            error
        }
    }
}

/**
 * Get all categories List.
 * @param {*} req 
 * @param {*} res 
 * @method getAllProducts
 * @returns 
 */
const getProductById = async (id, attributes = [], zip_code = '', userId = null) => {
    try {
        const product = await productDao.findOneAndRel({ id, is_active: true }, attributes, userId);
        if (product) {
            if (zip_code) {
                const deliveryRouteIds = product.delivery_route_ids.split(',');
                if (deliveryRouteIds) {
                    const checkRoute = await validateRouteAgainstProduct(zip_code, deliveryRouteIds);
                    if (!checkRoute) {
                        return { status: StatusCodes.OK, data: {}, error: 'Product is not deliverable in your location!' }
                    }
                }
            }
            return { status: StatusCodes.OK, data: product, error: null }
        } else {
            return { status: StatusCodes.OK, data: {}, error: 'Product is no longer available!' }
        }
    } catch (error) {
        console.error(error)
        return { status: StatusCodes.INTERNAL_SERVER_ERROR, data: null, error }
    }
}
const getWebProductById = async (id, attributes = [], zip_code = '', userId = null) => {
    try {
        const product = await productDao.findWebOneAndRel({ id, is_active: true, show_on_web: true }, attributes, userId);
        if (product) {
            if (zip_code) {
                const deliveryRouteIds = product.delivery_route_ids.split(',');
                if (deliveryRouteIds) {
                    const checkRoute = await validateRouteAgainstProduct(zip_code, deliveryRouteIds);
                    if (!checkRoute) {
                        return { status: StatusCodes.OK, data: {}, error: 'Product is not deliverable in your location!' }
                    }
                }
            }
            return { status: StatusCodes.OK, data: product, error: null }
        } else {
            return { status: StatusCodes.OK, data: {}, error: 'Product is no longer available!' }
        }
    } catch (error) {
        console.error(error)
        return { status: StatusCodes.INTERNAL_SERVER_ERROR, data: null, error }
    }
}

/**
 * update product quantity.
 * @param {*} productDetails 
 * @param {*} t
 */
const updateProductQuantity = async (productDetails, t) => {
    try {
        const resData = [];
        const product_ids = productDetails.map(x => x.product_id).filter(x => x !== undefined);
        if (!_.isEmpty(product_ids)) {
            const prodObj = {
                where: {
                    id: product_ids,
                    is_active: true
                },
                transaction: t
            };
            const productData = await productDao.findBy(prodObj);
            if (!_.isEmpty(productData)) {
                for (let prod of productData) {
                    const pData = productDetails.find(x => x.product_id === prod.id);
                    let reQuantity;
                    if (pData.type === PRODUCT_QUANTITY_ADD) {
                        reQuantity = Number(prod.stock_quantity) + Number(pData.quantity);
                    } else {
                        reQuantity = Number(prod.stock_quantity) - Number(pData.quantity);
                    }
                    const updateObj = {
                        stock_quantity: reQuantity > 0 ? reQuantity : 0,
                        stock_status: reQuantity == 0 ? false : true,
                    }
                    const [count, updateProductQuantity] = await productDao.updateT(pData.product_id, updateObj, t);
                    resData.push(updateProductQuantity);
                }
            }
        }
        return resData;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}

/**
 * 
 * @param {*} customObj 
 * @returns 
 */
const getCategoryProducts = async (customObj) => {
    try {
        const product = await productCategoryDao.getCategoryProducts(customObj);
        return { status: StatusCodes.OK, data: product, error: null }
    } catch (error) {
        return { status: StatusCodes.INTERNAL_SERVER_ERROR, data: null, error }
    }
}

/**
 * 
 * @param {*} product_id 
 * @returns 
 */
const getProductInventory = async (product_id, cartItems, orderItem) => {


    let product_type = orderItem && orderItem.dataValues && orderItem.dataValues.product_type || "";
    let from_date = cartItems.delivery_start_date || "";
    let to_date = cartItems.delivery_end_date || "";
    let quantity = cartItems.quantity || "";

    const result = {
        stock_status: STOCK_STATUS[0],
        remaining_stock: 0
    }

    if (!product_type) {
        return result;
    }



    try {
        const orderRes = {};

        let inventory_type = "";
        if (parseInt(product_type) === parseInt(1)) { /// For Variable Product 
            inventory_type = "PREDICTION";

            var startDate = moment(from_date);
            var endDate = moment(to_date);
            let remainingQuantity = 0;
            var now = startDate.clone(), outOfStockDateArr = [];
            while (now.isSameOrBefore(endDate)) {
                let inventoryData = {
                    product_id,
                    "inventory_type": inventory_type,
                    effective_date: now.format('YYYY-MM-DD')
                };
                let checkQuantity = await inventoryDao.getProductQuantity(inventoryData);
                let stockQuantity = checkQuantity && checkQuantity.dataValues && checkQuantity.dataValues.stock_quantity || 0;
                let customerTotalOrderPrediction = checkQuantity && checkQuantity.dataValues && checkQuantity.dataValues.customer_total_order_prediction || 0;
                remainingQuantity = parseFloat(stockQuantity) - parseFloat(customerTotalOrderPrediction);
                if (parseInt(remainingQuantity) < parseInt(quantity)) {
                    outOfStockDateArr.push(now.format('YYYY-MM-DD'));
                }
                now.add(1, 'days');
            }

            if (outOfStockDateArr.length > 0) {
                let errMessage = "Product is out of stock for following dates " + outOfStockDateArr;
                result.stock_status = STOCK_STATUS[0];
                result.remaining_stock = remainingQuantity;
                // return responseHelper.notFoundResponse(req, res, errMessage);
            } else {
                result.stock_status = STOCK_STATUS[1];
                result.remaining_stock = remainingQuantity;
                //return responseHelper.successResponse(req, res, orderRes, 'Product is available for cart');
            }

        } else {

            let productDteail = await productDao.findById(product_id);
            if (productDteail) {
                let stockQuantity = productDteail && productDteail.dataValues && productDteail.dataValues.stock_quantity || 0;
                if (parseInt(stockQuantity) >= parseInt(quantity)) {
                    result.stock_status = STOCK_STATUS[1];
                    result.remaining_stock = stockQuantity;
                    // return responseHelper.successResponse(req, res, orderRes, 'Product is available for cart');

                } else {
                    let errMessage = "Product is out of stock ";
                    result.stock_status = STOCK_STATUS[0];
                    result.remaining_stock = stockQuantity;
                    // return responseHelper.notFoundResponse(req, res, errMessage);
                }
            } else {
                //return responseHelper.notFoundResponse(req, res, "Not a valid product");
                result.stock_status = STOCK_STATUS[0];
                result.remaining_stock = 0;
            }

        }

        return result;

    } catch (error) {
        // transaction rollback.
        //await t.rollback();
        // return responseHelper.internalServerError(req, res, error);
        throw new Error(error.message);
    }





    // try {
    //     const prodInventory = await inventoryDao.findByProductId(product_id);
    //     const result = {
    //         stock_status: STOCK_STATUS[0],
    //         remaining_stock: 0
    //     }
    //     if (!_.isEmpty(prodInventory)) {
    //         const remainingStock = Math.round(Number(prodInventory[0].total_in) - Number(prodInventory[0].total_out)) || 0;
    //         result.stock_status = remainingStock !== 0 ? STOCK_STATUS[1] : STOCK_STATUS[0];
    //         result.remaining_stock = remainingStock;
    //     }
    //     return result;
    // } catch (e) {
    //     console.error(e);
    //     throw new Error(e.message);
    // }
}

module.exports = {
    addProductImages,
    addProductCategories,
    addProductTags,
    addProductConfigRules,
    addProductAttributes,
    addProductAttributeValues,
    disableProduct,
    disableProductImages,
    disableProductCategories,
    disableProductTags,
    disableProductConfRule,
    disableProductAttributes,
    disableProductAttributeValues,
    updateProductImage,
    updateProductCategories,
    updateProductTags,
    updateProdConfigRule,
    updateProductAttributes,
    checkUpdateProductAttributeAndValues,
    getAllProducts,
    getProductById,
    updateProductQuantity,
    getCategoryProducts,
    getProductInventory,
    getAllWebProducts,
    getWebProductById
}