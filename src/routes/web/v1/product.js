const { Router } = require('express');
const productWebController = require('../../../modules/product/product/productWebController');
const { idSchema, paginationQuerySchema, searchSchema, zipCodeSchema } = require('../../../request-validator/admin/common_validator');
const router = Router()

router.get('/products', paginationQuerySchema, productWebController.getAllProducts);
router.get('/:id', idSchema, zipCodeSchema, productWebController.getProductById);
router.get('/categoryProducts/:id', idSchema, paginationQuerySchema, productWebController.getCategoryProducts);
router.get('/search/product', searchSchema, paginationQuerySchema, productWebController.searchProduct);


module.exports = router