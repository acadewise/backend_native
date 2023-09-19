const { Router } =  require('express');
const configRuleController = require('../../../modules/configuration_rules/configurationRuleAdminController');
const router = Router()

router.get('/configRules', configRuleController.getAllConfigRules);

module.exports = router