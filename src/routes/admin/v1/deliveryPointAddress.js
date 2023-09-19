const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const deliveryPointAddressAdminController = require('../../../modules/delivery_point_address/deliveryPointAddressAdminController');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const { createDeliveryAddressSchema, updateDeliveryAddressSchema } = require('../../../request-validator/admin/delivery_address');
const router = Router();

router.post('/add', createDeliveryAddressSchema, activityLogs(Activity_Logs.DELIVERY_ADDRESS, Activity_Logs.DELIVERY_ADDRESS_CREATE), deliveryPointAddressAdminController.createDeliveryAddress);
router.get('/delivery_address', paginationQuerySchema, deliveryPointAddressAdminController.getAllDeliveryAddress);
router.get('/:id', idSchema, deliveryPointAddressAdminController.getDeliveryAddressById);
router.put('/:id', idSchema, updateDeliveryAddressSchema, activityLogs(Activity_Logs.DELIVERY_ADDRESS, Activity_Logs.DELIVERY_ADDRESS_UPDATE), deliveryPointAddressAdminController.updateDeliveryAddress);
router.delete('/:id', idSchema, activityLogs(Activity_Logs.DELIVERY_ADDRESS, Activity_Logs.DELIVERY_ADDRESS_DELETE), deliveryPointAddressAdminController.deleteDeliveryAddress);


module.exports = router