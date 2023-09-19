const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const moduleAdminController = require('../../../modules/module/moduleAdminController');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const { createModuleSchema, updateModuleSchema } = require('../../../request-validator/admin/module_validator');
const router = Router();

router.post('/', createModuleSchema, activityLogs(Activity_Logs.MODULE, Activity_Logs.MODULE_CREATE), moduleAdminController.createModule);
router.get('/modules', paginationQuerySchema, moduleAdminController.getAllModules);
router.get('/:id', idSchema, moduleAdminController.getModuleById);
router.put('/:id', idSchema, updateModuleSchema, activityLogs(Activity_Logs.MODULE, Activity_Logs.MODULE_UPDATE), moduleAdminController.updateModule);
router.delete('/:id', idSchema, activityLogs(Activity_Logs.MODULE, Activity_Logs.MODULE_DELETE), moduleAdminController.deleteModule);


module.exports = router