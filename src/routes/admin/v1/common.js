const { Router } = require('express');
const commonController = require('../../../modules/common/commonAdminController');
const { checkUniqueSchema } = require('../../../request-validator/admin/common_validator');
const router = Router();

router.get('/checkUnique', checkUniqueSchema, commonController.checkUnique);

module.exports = router;