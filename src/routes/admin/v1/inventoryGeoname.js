const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const inventoryGeonameAdminController = require('../../../modules/inventory_geonames/inventoryGeonameAdminController');
const { createInventoryGeonameSchema, updateInventoryGeonameSchema } = require('../../../request-validator/admin/inventory_geoname_validator');
const router = Router();

router.post('/', createInventoryGeonameSchema,
    activityLogs(Activity_Logs.INVENTORY_GEONAME, Activity_Logs.INVENTORY_GEONAME_CREATE),
    inventoryGeonameAdminController.createInventoryGeoname
);
router.get('/inventory_geoname', paginationQuerySchema, inventoryGeonameAdminController.getAllInventoryGeoname);
router.get('/get_geoList', paginationQuerySchema, inventoryGeonameAdminController.getInventoryGeonameList);
router.get('/:id', idSchema, inventoryGeonameAdminController.getInventoryGeonameById);

router.put('/:id', idSchema, updateInventoryGeonameSchema,
    activityLogs(Activity_Logs.INVENTORY_GEONAME, Activity_Logs.INVENTORY_GEONAME_UPDATE),
    inventoryGeonameAdminController.updateInventoryGeoname
);
router.delete('/:id', idSchema, activityLogs(Activity_Logs.INVENTORY_GEONAME,
    Activity_Logs.INVENTORY_GEONAME_DELETE),
    inventoryGeonameAdminController.deleteInventoryGeoname
);

module.exports = router