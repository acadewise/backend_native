const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const attributeAdminController = require('../../../modules/attributes/attributeAdminController');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const { createAttributeSchema, createAttributeWithValueSchema, updateAttributeSchema, updateAttributeAndValueSchema } = require('../../../request-validator/admin/attribute_validator');
const router = Router();

router.post('/', createAttributeSchema, activityLogs(Activity_Logs.ATTRIBUTE, Activity_Logs.ATTRIBUTE_CREATE), attributeAdminController.createAttribute);
router.post('/attributeValues', createAttributeWithValueSchema, activityLogs(Activity_Logs.ATTRIBUTE, Activity_Logs.ATTRIBUTE_AND_VAL_CREATE), attributeAdminController.createAttributeWithValues);
router.get('/attributes', paginationQuerySchema, attributeAdminController.getAllAttributes);
router.get('/:id', idSchema, attributeAdminController.getAttributeById);
router.put('/:id', idSchema, updateAttributeSchema, activityLogs(Activity_Logs.ATTRIBUTE, Activity_Logs.ATTRIBUTE_AND_VAL_UPDATE), attributeAdminController.updateAttribute);
router.put('/attributeValues/:id', idSchema, updateAttributeAndValueSchema, activityLogs(Activity_Logs.ATTRIBUTE, Activity_Logs.ATTRIBUTE_AND_VAL_UPDATE), attributeAdminController.updateAttributeAndValues);
router.delete('/:id', idSchema, activityLogs(Activity_Logs.ATTRIBUTE, Activity_Logs.ATTRIBUTE_AND_VAL_DELETE), attributeAdminController.deleteAttribute);


module.exports = router

