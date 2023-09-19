const { Admin, Common } = require('../../../constants/admin');
const { uploadImage } = require('../../../helper/file_handler');
const prodImgVidDao = require('./productImageVideoDao');
const { StatusCodes } = require('http-status-codes')
const productDao = require('../product/productDao');
const { PRODUCT_IMAGE_S3 } = require('../../../config/configuration_constant');

/**
 * Add images to product.
 * @param {*} req 
 * @param {*} res 
 */
const addProductImages = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.files;
        const images = [];
        const product = await productDao.findById(id);
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).send({
                status: { code: StatusCodes.NOT_FOUND, message: 'Product not found' }
            });
        }
        if (file) {
            for (const item of file) {
                let data = await uploadImage(item, PRODUCT_IMAGE_S3)
                if (data && data.Location) {
                    images.push(data.Location);
                } else {
                    res.status(StatusCodes.BAD_REQUEST);
                    return { status: { code: StatusCodes.BAD_REQUEST, message: Common.IMAGE_UPD_ERR } };
                }
            }
            const insertImages = file.flatMap((item, i) => [{
                product_id: id,
                type: 'image',
                url: images[i],
                position: i,
                is_active: true,
                created_by: req.adminData.id
            }]);
            const resImage = await prodImgVidDao.bulkCreate(insertImages);
            return res.status(StatusCodes.OK).send({
                status: { code: StatusCodes.OK, message: "Product images uploaded successfully" }, data: resImage
            })
        }
        return res.status(StatusCodes.NOT_FOUND).send({
            status: { code: StatusCodes.NOT_FOUND, message: "No Image attached for upload." }
        })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: { code: StatusCodes.INTERNAL_SERVER_ERROR, message: Common.INTERNAL_SERVER_ERR }, error
        })
    }
}

/**
 * Get All images data of product
 * @param {*} req 
 * @param {*} res 
 */
const getProductAllImages = async (req, res) => {
    try {
        const { id } = req.params;
        const imgObj = {
            where: { product_id: id, is_active: true },
        }
        const prodImgs = await prodImgVidDao.findBy(imgObj);
        return res.status(StatusCodes.OK).send({
            status: { code: StatusCodes.OK, message: "Product Images successfully fetched" }, data: prodImgs
        })
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: { code: StatusCodes.INTERNAL_SERVER_ERROR, message: Common.INTERNAL_SERVER_ERR }, error
        })
    }
}

/**
 * Get Images details.
 * @param {*} req 
 * @param {*} res 
 */
const getImageDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const prodImgs = await prodImgVidDao.findById(id);
        return res.status(StatusCodes.OK).send({
            status: { code: StatusCodes.OK, message: "Product Image data successfully fetched" }, data: prodImgs
        })
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: { code: StatusCodes.INTERNAL_SERVER_ERROR, message: Common.INTERNAL_SERVER_ERR }, error
        })
    }
}

/**
 * Update Product images data
 * @param {*} req 
 * @param {*} res 
 */
const updateProductImageData = async (req, res) => {
    try {
        const { id } = req.params;
        const imagData = req.body;
        const prodImgs = await productDao.findById(id);
        let resRes = [];
        if (!prodImgs) {
            return res.status(StatusCodes.NOT_FOUND).send({
                status: { code: StatusCodes.NOT_FOUND, message: "Product not found." }
            });
        }
        if (imagData) {
            for (let img of imagData) {
                const upId = img.id;
                const upObj = img;
                delete upObj.id;
                upObj.updated_by = req.adminData.id;
                const [count, update] = await prodImgVidDao.update(upId, upObj);
                resRes.push(update);
            }
        }
        return res.status(StatusCodes.OK).send({
            status: { code: StatusCodes.OK, message: "Product Images data updated successfully.", data: resRes }
        });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: { code: StatusCodes.INTERNAL_SERVER_ERROR, message: Common.INTERNAL_SERVER_ERR }, error
        })
    }
}

/**
 * Delete Product images data
 * @param {*} req 
 * @param {*} res 
 */
const deleteProductImages = async (req, res) => {
    try {
        const { id } = req.params
        const prodImg = await prodImgVidDao.findById(id);
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).send({
                status: { code: StatusCodes.NOT_FOUND, message: 'Product image not found' }
            });
        }
        const deletedData = await prodImgVidDao.softDelete(prodImg.id);
        return res.status(StatusCodes.OK).send({
            status: { code: StatusCodes.OK, message: "Product image successfully deleted" }, data: deletedData
        })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: { code: StatusCodes.INTERNAL_SERVER_ERROR, message: Common.INTERNAL_SERVER_ERR }, error
        })
    }
}

module.exports = {
    addProductImages,
    getProductAllImages,
    getImageDetails,
    updateProductImageData,
    deleteProductImages
}