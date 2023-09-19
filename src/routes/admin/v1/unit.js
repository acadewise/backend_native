const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const unitAdminController = require('../../../modules/units/unitAdminController');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const { createUnitSchema, updateUnitSchema } = require('../../../request-validator/admin/unit_validator');
const router = Router();

router.post('/', createUnitSchema, activityLogs(Activity_Logs.UNIT, Activity_Logs.UNIT_CREATE), unitAdminController.createUnit);
router.get('/units', paginationQuerySchema, unitAdminController.getAllUnits);
router.get('/:id', idSchema, unitAdminController.getUnitById);
router.put('/:id', idSchema, updateUnitSchema, activityLogs(Activity_Logs.UNIT, Activity_Logs.UNIT_UPDATE), unitAdminController.updateUnit);
router.delete('/:id', idSchema, activityLogs(Activity_Logs.UNIT, Activity_Logs.UNIT_DELETE), unitAdminController.deleteUnit);


module.exports = router