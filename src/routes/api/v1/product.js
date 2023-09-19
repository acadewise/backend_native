const { Router } = require('express');
const productApiController = require('../../../modules/product/product/productApiController');
const { idSchema, paginationQuerySchema, searchSchema, zipCodeSchema } = require('../../../request-validator/admin/common_validator');
const router = Router()

router.get('/products', paginationQuerySchema, productApiController.getAllProducts);
router.get('/:id', idSchema, zipCodeSchema, productApiController.getProductById);
router.get('/categoryProducts/:id', idSchema, paginationQuerySchema, productApiController.getCategoryProducts);
router.get('/search/product', searchSchema, paginationQuerySchema, productApiController.searchProduct);


module.exports = router