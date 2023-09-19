const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const brandAdminController = require('../../../modules/brand/brandAdminController');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const { createBrandSchema, updateBrandSchema } = require('../../../request-validator/admin/brand_validator');
const router = Router();

router.post('/', createBrandSchema, activityLogs(Activity_Logs.BRAND, Activity_Logs.BRAND_CREATE), brandAdminController.createBrand);
router.get('/brands', paginationQuerySchema, brandAdminController.getAllBrands);
router.get('/:id', idSchema, brandAdminController.getBrandById);
router.put('/:id', idSchema, updateBrandSchema, activityLogs(Activity_Logs.BRAND, Activity_Logs.BRAND_UPDATE), brandAdminController.updateBrand);
router.delete('/:id', idSchema, activityLogs(Activity_Logs.BRAND, Activity_Logs.BRAND_DELETE), brandAdminController.deleteBrand);

module.exports = router