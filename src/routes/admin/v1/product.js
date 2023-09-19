const { Router } = require('express');
const { upload } = require('../../../helper/file_handler');
const { Activity_Logs } = require('../../../constants/admin')
const createActivityLogs = require('../../../middlewares/activity_log')
const { MAX_IMAGE_UPLOAD } = require('../../../config/configuration_constant');
const productAdminController = require('../../../modules/product/product/productAdminController');
const prodImgVidAdCont = require('../../../modules/product/product_image_videos/prodImgVidAdminController')
const { idSchema, searchSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const { createProductSchema, updateProductSchema, updateProdImgSchema } = require('../../../request-validator/admin/product_validator');
const router = Router();

// product api's

router.post('/', createProductSchema, createActivityLogs(Activity_Logs.PROD, Activity_Logs.PROD_CREATE), productAdminController.createProduct);
router.get('/products', paginationQuerySchema, productAdminController.getAllProducts);
router.get('/:id', idSchema, productAdminController.getProductById);
router.put('/:id', idSchema, updateProductSchema, createActivityLogs(Activity_Logs.PROD, Activity_Logs.PROD_UPDATE), productAdminController.updateProduct);
router.delete('/:id', idSchema, createActivityLogs(Activity_Logs.PROD, Activity_Logs.PROD_DELETE), productAdminController.deleteProduct);
router.get('/search/product', searchSchema, paginationQuerySchema, productAdminController.searchProduct);
router.delete('/removeProdImage/:id', idSchema, createActivityLogs(Activity_Logs.PROD, Activity_Logs.PROD_IMG_DELETE), productAdminController.removeProductImage);

// product image and videos api's

router.post('/addProdImages/:id', upload.array('images', MAX_IMAGE_UPLOAD), prodImgVidAdCont.addProductImages);
router.put('/updateProdImages/:id', idSchema, updateProdImgSchema, prodImgVidAdCont.updateProductImageData);
router.get('/getProdImages/:id', idSchema, prodImgVidAdCont.getProductAllImages);
router.get('/getImages/:id', idSchema, prodImgVidAdCont.getImageDetails);
router.delete('/deleteProdImage/:id', idSchema, prodImgVidAdCont.deleteProductImages);



module.exports = router