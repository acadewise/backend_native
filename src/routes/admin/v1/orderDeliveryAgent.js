const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const orderDeliveryAgentAdminController = require('../../../modules/order_delivery_agent/orderDeliveryAgentAdminController');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const { createOrderDeliveryAgentSchema, updateOrderDeliveryAgentSchema } = require('../../../request-validator/admin/order_delivery_agent');
const router = Router();

router.post('/add', createOrderDeliveryAgentSchema, activityLogs(Activity_Logs.ORDER_DELIVERY_AGENT, Activity_Logs.ORDER_DELIVERY_AGENT_CREATE), orderDeliveryAgentAdminController.createOrderDeliveryAgent);
router.get('/ORDER_DELIVERY_AGENT', paginationQuerySchema, orderDeliveryAgentAdminController.getAllOrderDeliveryAgent);
router.get('/:id', idSchema, orderDeliveryAgentAdminController.getOrderDeliveryAgentById);
router.put('/:id', idSchema, updateOrderDeliveryAgentSchema, activityLogs(Activity_Logs.ORDER_DELIVERY_AGENT, Activity_Logs.ORDER_DELIVERY_AGENT_UPDATE), orderDeliveryAgentAdminController.updateOrderDeliveryAgent);
router.delete('/:id', idSchema, activityLogs(Activity_Logs.ORDER_DELIVERY_AGENT, Activity_Logs.ORDER_DELIVERY_AGENT_DELETE), orderDeliveryAgentAdminController.deleteOrderDeliveryAgent);


module.exports = router