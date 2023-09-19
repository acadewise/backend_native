const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const orderPaymentHistoryAdminController = require('../../../modules/orders/orderPaymentHistory/orderPaymentHistoryAdminController');
const { idSchema, paginationQuerySchema, searchSchema } = require('../../../request-validator/admin/common_validator');
const { createPaymentSchema } = require('../../../request-validator/admin/payment_history_validator');
const router = Router();

router.post('/add', createPaymentSchema,  orderPaymentHistoryAdminController.createPaymentHistory);
router.get('/history', paginationQuerySchema, orderPaymentHistoryAdminController.getAllPaymentHistory);
router.get('/pdetails', paginationQuerySchema, orderPaymentHistoryAdminController.getSinglePaymentHistory);




module.exports = router