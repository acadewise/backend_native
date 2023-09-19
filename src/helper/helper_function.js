const {
    CUSTOMER_PROFILE_S3, BRAND_S3, PRODUCT_IMAGE_S3, CATEGORY_IMAGE_S3, EXTRA_S3, ATTRIBUTE_IMAGE_S3,
    ATTRIBUTE_VALUE_IMAGE_S3, PAGE_SIZE, SORT_ORDER } = require('../config/configuration_constant');
const deliveryRouteDao = require('../modules/delivery_route/deliveryRouteDao');

/**
 * Function checks if object is empty or not.
 * @param {*} obj 
 * @returns 
 */
const isEmptyObj = function (obj) {
    return Object.keys(obj).length === 0;
}

/**
 * Get s3 folder name.
 * @param {*} type 
 * @returns 
 */
const getS3FolderName = function (type) {
    let folder = EXTRA_S3;
    switch (type) {
        case 'profile_image':
            folder = CUSTOMER_PROFILE_S3;
            break;
        case 'brand':
            folder = BRAND_S3;
            break;
        case 'category':
            folder = CATEGORY_IMAGE_S3;
            break;
        case 'product':
            folder = PRODUCT_IMAGE_S3;
            break;
        case 'attribute':
            folder = ATTRIBUTE_IMAGE_S3;
            break;
        case 'attribute_value':
            folder = ATTRIBUTE_VALUE_IMAGE_S3;
            break;
        default:
            folder = EXTRA_S3;
            break;
    }
    return folder;
}

/**
 * Check if passed input is a number or not.
 * @param {*} str 
 * @returns 
 */
const isNumber = (str) => {
    return /^[0-9]+$/.test(str);
}

/**
 * Validate if string is email.
 * @param {*} email 
 * @returns 
 */
const isValidEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * compute and return pagination params.
 * @param {*} req 
 * @returns 
 */
const getPageAndLimit = (req) => {
    let { page: _page = 1 } = req.query;
    let per_page = req.query.per_page || PAGE_SIZE;
    let sortOrder = req.query.sortOrder || SORT_ORDER;
    let page = _page ? (_page - 1) * per_page : 0;
    page = page < 0 ? 0 : page;
    let limit = parseInt(per_page);
    limit = limit < 0 ? PAGE_SIZE : limit;
    return { _page, page, limit, sortOrder }
}

/**
 * Generate random unique string.
 * @param {*} inputStr 
 * @returns 
 */
const generateUniqueString = (inputStr) => {
    let now = Date.now().toString();
    let newStr = inputStr.toLowerCase().trim().replace(/\s+/g, '-');
    newStr += '-' + now;
    return newStr;
}

const generateUniqueNumber = (inputStr) => {
    let now = Date.now().toString();
    
    return now;
}

/**
 * 
 * @param {*} startDate 
 * @param {*} endDate 
 * @returns 
 */
const getDateRange = (startDate, endDate) => {
    var now = startDate.clone(), dates = [];
    while (now.isSameOrBefore(endDate)) {
        dates.push(now.format('MM/DD/YYYY'));
        now.add(1, 'days');
    }
    return dates;

}

/**
 * 
 * @param {*} zip_code 
 * @returns 
 */
const getRouteByZipCode = async (zip_code) => {
    try {
        const routeIds = await deliveryRouteDao.getRouteIdsByZip(zip_code);
        return routeIds;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}

const validateRouteAgainstProduct = async (zip_code, deliveryRoutes) => {
    try {
        const routeIds = await getRouteByZipCode(zip_code);
        const mapIds = routeIds.map(x => parseInt(x.id));
         if (mapIds.length) {
            const checkRoute = deliveryRoutes.some(x => {
                return mapIds.includes(parseInt(x));
            });
            return checkRoute;
        }
        return false;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}

module.exports = {
    isEmptyObj,
    getS3FolderName,
    isNumber,
    isValidEmail,
    getPageAndLimit,
    generateUniqueString,
    getDateRange,
    getRouteByZipCode,
    validateRouteAgainstProduct,
    generateUniqueNumber
}