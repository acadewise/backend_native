const { StatusCodes } = require('http-status-codes');
const { Common } = require('../constants/admin');

/**
 * Return internal Server Error.
 * @param {*} req 
 * @param {*} res 
 * @param {*} error 
 * @returns 
 */
const internalServerError = (req, res, error = 'Internal Server Error') => {
    console.log("error>>> ", error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status: { code: StatusCodes.INTERNAL_SERVER_ERROR, message: Common.INTERNAL_SERVER_ERR }, error
    })
}

/**
 * Return success response.
 * @param {*} req 
 * @param {*} res 
 * @param {*} resData 
 * @param {*} msg 
 * @returns 
 */
const successResponse = (req, res, resData, msg) => {
    return res.status(StatusCodes.OK).send({
        status: { code: StatusCodes.OK, message: msg }, data: resData
    });
}

/**
 * Return success response with token data.
 * @param {*} req 
 * @param {*} res 
 * @param {*} resData 
 * @param {*} msg 
 * @returns 
 */
const successResponseToken = (req, res, resData, token, msg) => {
    return res.status(StatusCodes.OK).send({
        status: { code: StatusCodes.OK, message: msg }, data: resData, token
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} message 
 * @returns 
 */
const notFoundResponse = (req, res, message) => {
    return res.status(StatusCodes.BAD_REQUEST).send({
        status: { code: StatusCodes.BAD_REQUEST, message }
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} warningResponse 
 * @param {*} message 
 * @returns 
 */
const warningResponse = (req, res, warningResponse, message) => {
    return res.status(StatusCodes.CONFLICT).send({
        status: { code: StatusCodes.CONFLICT, warnings: warningResponse, message }
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} data 
 * @param {*} message 
 * @returns 
 */
const successResponseWithCount = (req, res, data, message) => {
    return res.status(StatusCodes.OK).send({
        status: { code: StatusCodes.OK, message },
        data: data.data, count: data.count, page: data.page,
        per_page: data.per_page, total_pages: data.total_pages
    });
}

const successResponseWithAddtionalField = (req, res, data, message) => {
    return res.status(StatusCodes.OK).send({
        status: { code: StatusCodes.OK, message },
        ...data
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res
 * @param {*} message 
 * @returns 
 */
const badReqResponse = (req, res, message) => {
    return res.status(StatusCodes.BAD_REQUEST).send({
        status: {
            code: StatusCodes.BAD_REQUEST, message
        }
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} status 
 * @param {*} data 
 * @param {*} error 
 * @param {*} limit 
 * @param {*} originalPageValue 
 * @param {*} message 
 * @returns 
 */
const apiResponseSuccessList = (req, res, status, data, error, limit, originalPageValue, message) => {
    if (status && status === StatusCodes.OK && data) {
        const resData = {
            data: data.rows,
            count: data.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((data.count / limit))
        }
        return successResponseWithCount(req, res, resData, message);
    }
    if (status && status === StatusCodes.INTERNAL_SERVER_ERROR) {
        return internalServerError(req, res, error)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} status 
 * @param {*} data 
 * @param {*} error 
 * @param {*} message 
 * @returns 
 */
const apiResponseSuccess = (req, res, status, data, error, message) => {
    if (status && status === StatusCodes.OK && data) {
        return successResponse(req, res, data, message);
    }
    if (status && status === StatusCodes.INTERNAL_SERVER_ERROR) {
        return internalServerError(req, res, error)
    }
}
module.exports = {
    internalServerError,
    successResponse,
    successResponseToken,
    notFoundResponse,
    warningResponse,
    successResponseWithCount,
    badReqResponse,
    apiResponseSuccessList,
    apiResponseSuccess,
    successResponseWithAddtionalField
}