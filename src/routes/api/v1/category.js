const { Router } = require('express');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const categoryApiController = require('../../../modules/category/categoryApiController');
const router = Router()

router.get('/categories', paginationQuerySchema, categoryApiController.getAllCategories);
router.get('/subcategories/:id', idSchema, categoryApiController.getSubCategories);
router.get('/parentcategories', paginationQuerySchema, categoryApiController.getAllParentCategories);


module.exports = router