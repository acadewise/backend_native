const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const deliveryAgentAdminController = require('../../../modules/delivery_agent/deliveryAgentAdminController');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const { createOrderDeliveryAgentSchema, updateOrderDeliveryAgentSchema } = require('../../../request-validator/admin/order_delivery_agent');
const router = Router();

router.post('/updateStatus',  activityLogs(Activity_Logs.DELIVERY_ADDRESS, Activity_Logs.DELIVERY_ADDRESS_CREATE), deliveryAgentAdminController.createOrderDeliveryAgent);
router.get('/orders', paginationQuerySchema, deliveryAgentAdminController.getAllOrderDeliveryAgent);
router.get('/routes', paginationQuerySchema, deliveryAgentAdminController.getDeliveryAgentRoutes);
router.get('/delivery_report', paginationQuerySchema, deliveryAgentAdminController.getAllOrderDeliveryReports);
router.get('/delivery_item_report', paginationQuerySchema, deliveryAgentAdminController.getAllOrderDeliveryItemsReports);
router.get('/:id', idSchema, deliveryAgentAdminController.getOrderDeliveryAgentById);
router.delete('/:id', idSchema, activityLogs(Activity_Logs.DELIVERY_AGENT, Activity_Logs.DELIVERY_AGENT_DELETE), deliveryAgentAdminController.deleteOrderDeliveryAgent);


module.exports = router