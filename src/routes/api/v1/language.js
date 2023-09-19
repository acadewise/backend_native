const { Router } =  require('express');
const languageApiController = require('../../../modules/language/languageApiController');
const router = Router()

router.get('/languages', languageApiController.getAllLanguages);


module.exports = router