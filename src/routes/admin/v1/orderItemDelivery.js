const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const orderItemDeliveryAdminController = require('../../../modules/orders/orderItemDelivery/orderItemDeliveryAdminController');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const { createOrderDeliveryAgentSchema, updateOrderDeliveryAgentSchema } = require('../../../request-validator/admin/order_delivery_agent');
const router = Router();

router.post('/add',  activityLogs(Activity_Logs.ORDER_DELIVERY_AGENT, Activity_Logs.ORDER_DELIVERY_AGENT_CREATE), orderItemDeliveryAdminController.createOrderItemDelivery);
router.get('/order_item_delivery', paginationQuerySchema, orderItemDeliveryAdminController.getAllOrderItemDelivery);
router.get('/get_deliverables_item', paginationQuerySchema, orderItemDeliveryAdminController.getDeliverablesItems);
router.get('/:id', orderItemDeliveryAdminController.getOrderItemDeliveryById);


module.exports = router