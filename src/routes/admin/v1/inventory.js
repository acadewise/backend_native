const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const inventoryAdminController = require('../../../modules/inventory/inventoryAdminController');
const { idSchema, paginationQuerySchema, searchSchema } = require('../../../request-validator/admin/common_validator');
const { createInventorySchema, updateInventorySchema } = require('../../../request-validator/admin/inventory_validator');
const router = Router();

router.post('/add', createInventorySchema, activityLogs(Activity_Logs.INVENTORY, Activity_Logs.INVENTORY_CREATE), inventoryAdminController.createInventory);
router.get('/inventory', paginationQuerySchema, inventoryAdminController.getAllInventory);
router.get('/search/inventory', paginationQuerySchema, inventoryAdminController.searchInventory);
router.get('/:id', idSchema, inventoryAdminController.getInventoryById);
router.get('/product/:id', idSchema, inventoryAdminController.getInventoryByProductId);
router.delete('/:id', idSchema, activityLogs(Activity_Logs.INVENTORY, Activity_Logs.INVENTORY_DELETE), inventoryAdminController.deleteInventory);
router.put('/:id', idSchema, updateInventorySchema,
    activityLogs(Activity_Logs.INVENTORY, Activity_Logs.INVENTORY_UPDATE),
    inventoryAdminController.updateInventory
);


module.exports = router