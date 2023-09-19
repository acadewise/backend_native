const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const deliveryRouteAdminController = require('../../../modules/delivery_route/deliveryRouteAdminController');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const { createDeliveryRouteSchema, updateDeliveryRouteSchema } = require('../../../request-validator/admin/delivery_route');
const router = Router();

router.post('/add', createDeliveryRouteSchema, activityLogs(Activity_Logs.DELIVERY_ROUTE, Activity_Logs.DELIVERY_ROUTE_CREATE), deliveryRouteAdminController.createDeliveryRoute);
router.get('/delivery_route', paginationQuerySchema, deliveryRouteAdminController.getAllDeliveryRoute);
router.get('/:id', idSchema, deliveryRouteAdminController.getDeliveryRouteById);
router.put('/:id', idSchema, updateDeliveryRouteSchema, activityLogs(Activity_Logs.DELIVERY_ROUTE, Activity_Logs.DELIVERY_ROUTE_UPDATE), deliveryRouteAdminController.updateDeliveryRoute);
router.delete('/:id', idSchema, activityLogs(Activity_Logs.DELIVERY_ROUTE, Activity_Logs.DELIVERY_ROUTE_DELETE), deliveryRouteAdminController.deleteDeliveryRoute);


module.exports = router