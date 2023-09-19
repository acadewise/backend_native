const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const createActivityLogs = require('../../../middlewares/activity_log')
const adminAdminController = require('../../../modules/admin/adminAdminController');
const { idSchema, paginationQuerySchema, uuIdSchema } = require('../../../request-validator/admin/common_validator');
const { createAdminSchema, updateAdminSchema, activeInactiveAdminSchema } = require('../../../request-validator/admin/admin_validator');
const router = Router()

router.get('/admins', paginationQuerySchema, adminAdminController.getAllAdmins);
router.get('/:id', uuIdSchema, adminAdminController.getAdminById);
router.post('/', createAdminSchema, createActivityLogs(Activity_Logs.ADMIN, Activity_Logs.ADMIN_CREATE), adminAdminController.createAdmin);
router.put('/:id', uuIdSchema, updateAdminSchema, createActivityLogs(Activity_Logs.ADMIN, Activity_Logs.ADMIN_UPDATE), adminAdminController.updateAdmin);
router.get('/profile/:id/:status', activeInactiveAdminSchema, createActivityLogs(Activity_Logs.ADMIN, Activity_Logs.ADMIN_CHANGE_STATUS), adminAdminController.activeInactiveAdmin);

module.exports = router