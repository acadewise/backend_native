const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const attributeValueAdminController = require('../../../modules/attribute_values/attributeValueAdminController');
const { createAttributeValueSchema, updateAttributeValueSchema } = require('../../../request-validator/admin/attributevalue_validator');
const router = Router();

router.post('/', createAttributeValueSchema, activityLogs(Activity_Logs.ATTRIBUTE_VALUE, Activity_Logs.ATTRIBUTE_AND_VAL_CREATE), attributeValueAdminController.createAttributeValue);
router.get('/attributeValues', paginationQuerySchema, attributeValueAdminController.getAllAttributeValues);
router.get('/:id', idSchema, attributeValueAdminController.getAttributeValueById);
router.put('/:id', idSchema, updateAttributeValueSchema, activityLogs(Activity_Logs.ATTRIBUTE_VALUE, Activity_Logs.ATTRIBUTE_AND_VAL_UPDATE), attributeValueAdminController.updateAttributeValue);
router.delete('/:id', idSchema, activityLogs(Activity_Logs.ATTRIBUTE_VALUE, Activity_Logs.ATTRIBUTE_AND_VAL_DELETE), attributeValueAdminController.deleteAttributeValue);

module.exports = router