const supplierDao = require("./supplierDao");
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');

/**
 * Create supplier.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createSupplier = async (req, res) => {
    try {
        const { owner_name, bussiness_name, phone_number, supplier_email, gst_number, street_address, city, state, zipcode, landmark, is_active } = req.body;
        const supplierData = {
            owner_name,
            bussiness_name,
            phone_number,
            supplier_email,
            gst_number,
            street_address,
            city,
            state,
            zipcode,
            landmark,
            is_active,
            created_by: req.adminData.id
        };
        const supplierRes = await supplierDao.create(supplierData);
        return responseHelper.successResponse(req, res, supplierRes, "supplier successfully created.");
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
const getAllSuppliers = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
        const supplierList = await supplierDao.findAllWithAttributesAndPagination(attributes, page, limit)
        const resData = {
            data: supplierList.rows,
            count: supplierList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((supplierList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "suppliers records successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Get suppliers details by Id.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplierData = await supplierDao.findById(id);
        if (!supplierData) {
            return responseHelper.notFoundResponse(req, res, "supplier Data not found!");
        }
        return responseHelper.successResponse(req, res, supplierData, "supplier data successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Update supplier details.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = req.body;
        delete updates.id;
        const supplierData = await supplierDao.findById(id);
        if (!supplierData) {
            return responseHelper.notFoundResponse(req, res, "supplier Data not found!");
        }
        updates.updated_by = req.adminData.id;
        const [count, supplierNewData] = await supplierDao.update(supplierData.id, updates);
        return responseHelper.successResponse(req, res, supplierNewData, "supplier record successfully updated");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

/**
 * Soft Delete supplier.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const supplierData = await supplierDao.findById(id);
        if (!supplierData) {
            return responseHelper.notFoundResponse(req, res, "supplier Data not found!");
        }
        const supplierRes = await supplierDao.softDelete(supplierData.id);
        return responseHelper.successResponse(req, res, supplierRes, "supplier successfully deleted");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
};
