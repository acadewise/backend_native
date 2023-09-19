const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const systemSettingAdminController = require('../../../modules/system_settings/systemSettingAdminController');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const { createCouponMasterSchema, updateCouponMasterSchema } = require('../../../request-validator/admin/coupon_master');
const router = Router();

router.post('/add',   systemSettingAdminController.createSystemSetting);
router.get('/list', paginationQuerySchema, systemSettingAdminController.getAllSettings);




module.exports = router