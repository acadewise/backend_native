const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const deliveryRouteAgentAdminController = require('../../../modules/delivery_route_agent/deliveryRouteAgentAdminController');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const { createDeliveryRouteSchema, updateDeliveryRouteSchema } = require('../../../request-validator/admin/delivery_route');
const router = Router();


router.get('/delivery_route_agent', paginationQuerySchema, deliveryRouteAgentAdminController.getAllDeliveryRouteAgent);


module.exports = router