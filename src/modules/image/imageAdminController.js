const { getS3FolderName } = require('../../helper/helper_function');
const { StatusCodes } = require("http-status-codes");
const { Admin, Common } = require('../../constants/admin');
const { uploadImage, deleteImage } = require("../../helper/file_handler");
const imageDao = require("./imageDao");
const { IMAGE_QUALITY } = require("../../config/configuration_constant");

/**
 * Get image detail.
 * @param {*} req 
 * @param {*} res 
 */
const getImage = async (req, res) => {
    try {
        const { id } = req.params;

        const imageData = await imageDao.findById(id);

        if (!imageData)
            return res.status(StatusCodes.BAD_REQUEST).send({
                status: { code: StatusCodes.BAD_REQUEST, message: "Image does not found." },
            });
        return res.status(StatusCodes.OK).send({
            status: {
                code: StatusCodes.OK,
                message: "Image data successfully fetched",
            },
            data: imageData,
        });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                message: Common.INTERNAL_SERVER_ERR,
            },
            error,
        });
    }
}

/**
 * Upload images.
 * @param {*} req 
 * @param {*} res 
 */
const uploadSingleImage = async (req, res) => {
    try {
        const image = req.file;
        const { media_type, type, quality } = req.body;
        let avatarData;
        if (image) {
            const folder = getS3FolderName(type);
            avatarData = await uploadImage(image, folder, quality || IMAGE_QUALITY);
            if (!avatarData) {
                res.status(StatusCodes.BAD_REQUEST);
                return { status: { code: StatusCodes.BAD_REQUEST, message: Common.IMAGE_UPD_ERR } };
            }
            const imgObj = {
                media_type,
                type,
                url: avatarData.Location,
                created_by: req.adminData.id
            }

            const imageUpload = await imageDao.create(imgObj);
            return res.status(StatusCodes.OK).send({
                status: {
                    code: StatusCodes.OK,
                    message: "Image successfully Added",
                },
                data: imageUpload,
            });
        }
        return res.status(StatusCodes.NOT_FOUND).send({
            status: { code: StatusCodes.NOT_FOUND, message: "No Image attached for upload." }
        });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: {
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                message: Common.INTERNAL_SERVER_ERR,
            },
            error,
        });
    }
}

/**
 * Upload images.
 * @param {*} req 
 * @param {*} res 
 */
const uploadMultipleImages = async (req, res) => {
    try {
        const file = req.files;
        const { media_type, type, quality } = req.body;
        const images = [];
        if (file.length > 0) {
            const folder = getS3FolderName(type);
            for (const item of file) {
                let data = await uploadImage(item, folder, quality || IMAGE_QUALITY)
                if (data && data.Location) {
                    images.push(data.Location);
                } else {
                    res.status(StatusCodes.BAD_REQUEST);
                    return { status: { code: StatusCodes.BAD_REQUEST, message: Common.IMAGE_UPD_ERR } };
                }
            }
            const insertImages = file.flatMap((item, i) => [{
                media_type,
                type,
                url: images[i],
                created_by: req.adminData.id
            }]);
            const resImage = await imageDao.bulkCreate(insertImages);
            return res.status(StatusCodes.OK).send({
                status: { code: StatusCodes.OK, message: "Images uploaded successfully" }, data: resImage
            })
        }
        return res.status(StatusCodes.NOT_FOUND).send({
            status: { code: StatusCodes.NOT_FOUND, message: "No Image attached for upload." }
        });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: { code: StatusCodes.INTERNAL_SERVER_ERROR, message: Common.INTERNAL_SERVER_ERR }, error
        })
    }
}

/**
 * Delete image.
 * @param {*} req 
 * @param {*} res 
 */
const deleteImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const imgData = await imageDao.findById(id);
        if (!imgData) {
            return res.status(StatusCodes.NOT_FOUND).send({
                status: { code: StatusCodes.NOT_FOUND, message: 'Image does not found' }
            });
        }
        const folder = getS3FolderName(imgData.type);
        const filename = imgData.url.split(folder + '/');
        await deleteImage(filename[1], folder);
        const deletedData = await imageDao.hardDelete(imgData.id);
        return res.status(StatusCodes.OK).send({
            status: { code: StatusCodes.OK, message: "Image successfully deleted" }, data: deletedData
        })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: { code: StatusCodes.INTERNAL_SERVER_ERROR, message: Common.INTERNAL_SERVER_ERR }, error
        })
    }
}



module.exports = { getImage, uploadSingleImage, uploadMultipleImages, deleteImageById }