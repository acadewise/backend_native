const { Router } = require('express')
const { Activity_Logs } = require('../../../constants/admin');
const createActivityLogs = require('../../../middlewares/activity_log');
const tagsAdminController = require('../../../modules/tags/tagsAdminController');
const { createTagSchema, updateTagSchema } = require('../../../request-validator/admin/tag_validator');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const router = Router();

router.post('/', createTagSchema, createActivityLogs(Activity_Logs.PRODTAG, Activity_Logs.PROD_TAG_CREATE), tagsAdminController.createTag);
router.get('/tags', paginationQuerySchema, tagsAdminController.getAllTags);
router.get('/:id', idSchema, tagsAdminController.getTagById);
router.put('/:id', idSchema, updateTagSchema, createActivityLogs(Activity_Logs.PROD, Activity_Logs.PROD_UPDATE), tagsAdminController.updateTag);
router.delete('/:id', idSchema, createActivityLogs(Activity_Logs.PROD, Activity_Logs.PROD_DELETE), tagsAdminController.deleteTag);


module.exports = router