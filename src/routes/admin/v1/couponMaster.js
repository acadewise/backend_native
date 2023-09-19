const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const couponMasterAdminController = require('../../../modules/coupon_master/couponMasterAdminController');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const { createCouponMasterSchema, updateCouponMasterSchema } = require('../../../request-validator/admin/coupon_master');
const router = Router();

router.post('/add', createCouponMasterSchema, activityLogs(Activity_Logs.COUPON_MASTER, Activity_Logs.COUPON_MASTER_CREATE), couponMasterAdminController.createCouponMaster);
router.get('/coupon_master', paginationQuerySchema, couponMasterAdminController.getAllCouponMaster);
router.get('/:id', idSchema, couponMasterAdminController.getCouponMasterById);
router.put('/:id', idSchema, updateCouponMasterSchema, activityLogs(Activity_Logs.COUPON_MASTER, Activity_Logs.COUPON_MASTER_UPDATE), couponMasterAdminController.updateCouponMaster);
router.delete('/:id', idSchema, activityLogs(Activity_Logs.COUPON_MASTER, Activity_Logs.COUPON_MASTER_DELETE), couponMasterAdminController.deleteCouponMaster);


module.exports = router