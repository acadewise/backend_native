const tagDao = require('./tagsDao');
const responseHelper = require('../../helper/response_utility');
const { getPageAndLimit } = require('../../helper/helper_function');

/**
 * Get all Tags list.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getAllTags = async (req, res) => {
    try {
        const attributes = ['id', 'name', 'description', 'status']
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const tagsList = await tagDao.findAllWithAttributesAndPagination(attributes, page, limit)
        const resData = {
            data: tagsList.rows,
            count: tagsList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((tagsList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "Tags successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Get tag details by Id.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await tagDao.findById(id);
        if (!tag) {
            return responseHelper.notFoundResponse(req, res, 'Tag not found');
        }
        const attributes = ['id', 'name', 'description','status'];
        const tagData = await tagDao.findOneWithAttributes({ id: tag.id }, attributes)
        return responseHelper.successResponse(req, res, tagData, "Tag successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Create tag.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const createTag = async (req, res) => {
    try {
        const TagData = req.body;
        TagData.created_by = req.adminData.id;
        const tag = await tagDao.create(TagData);
        return responseHelper.successResponse(req, res, tag, "Tag successfully created.");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Update tag details.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const tagPayload = req.body;
        delete tagPayload.id;
        const tag = await tagDao.findById(id);
        if (!tag) {
            return responseHelper.notFoundResponse(req, res, 'Tag not found');
        }
        tagPayload.updated_by = req.adminData.id;
        const [count, tagData] = await tagDao.update(tag.id, tagPayload)
        return responseHelper.successResponse(req, res, tagData, "Tag successfully Updated");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Soft delete a tag.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const deleteTag = async (req, res) => {
    try {
        const { id } = req.params
        const tag = await tagDao.findById(id);
        if (!tag) {
            return responseHelper.notFoundResponse(req, res, 'Tag not found');
        }
        const deletedData = await tagDao.softDelete(tag.id);
        return responseHelper.successResponse(req, res, deletedData, "Tag successfully deleted");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

module.exports = {
    getAllTags,
    getTagById,
    createTag,
    updateTag,
    deleteTag
}
