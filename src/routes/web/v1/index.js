const { Router } = require('express')
const { verifyAdminToken } = require('../../../middlewares/token_manager')
const router = Router();

const category = require('./category');
const product = require('./product');


router.use('/category',  category);
router.use('/product',  product);


module.exports = router
