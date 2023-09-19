const { Router } = require('express');
const systemSettingController = require('../../../modules/system_settings/systemSettingAdminController');
const router = Router()

router.get('/systemSetting', systemSettingController.getAllSettings);

module.exports = router