const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin')
const createActivityLogs = require('../../../middlewares/activity_log');
const categoryAdminController = require('../../../modules/category/categoryAdminController');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const { createCategorySchema, updateCategorySchema } = require('../../../request-validator/admin/category_validator');
const router = Router()

router.post('/', createCategorySchema, createActivityLogs(Activity_Logs.CATE, Activity_Logs.CATE_CREATE), categoryAdminController.createCategory);
router.get('/categories', paginationQuerySchema, categoryAdminController.getAllCategories);
router.get('/:id', idSchema, categoryAdminController.getCategoryById);
router.put('/:id', idSchema, updateCategorySchema, createActivityLogs(Activity_Logs.CATE, Activity_Logs.CATE_UPDATE), categoryAdminController.updateCategory);
router.delete('/:id', idSchema, createActivityLogs(Activity_Logs.CATE, Activity_Logs.CATE_DELETE), categoryAdminController.deleteCategory);
router.get('/categoryAttribute/:id', idSchema, categoryAdminController.getCategoryAttributes);

module.exports = router