const { Router } = require('express')
const { verifyAdminToken } = require('../../../middlewares/token_manager')
const router = Router();
const auth = require('./auth');
const user = require('./user');
const admin = require('./admin');
const category = require('./category');
const brand = require('./brand');
const moduleM = require('./module');
const product = require('./product');
const tag = require('./tag');
const unit = require('./unit');
const attribute = require('./attribute');
const attributeValue = require('./attributeValue');
const configRule = require('./configurationRules');
const order = require('./order');
const image = require('./image');
const common = require('./common');
const inventoryGeoname = require('./inventoryGeoname');
const language = require('./language');
const supplier = require('./supplier');
const inventory = require('./inventory');
const deliveryPointAddress = require('./deliveryPointAddress');
const deliveryRoute = require('./deliveryRoute');
const couponMaster = require('./couponMaster');
const deliveryRouteAgent = require('./deliveryRouteAgent');
const orderDeliveryAgent = require('./orderDeliveryAgent');
const deliveryAgent = require('./deliveryAgent');
const orderItemDelivery = require('./orderItemDelivery');
const systemSetting = require('./systemSetting');
const orderPaymentHistory = require('./orderPaymentHistory');
const userUnavailability = require('./userUnavailability');

router.use('/auth', auth);
router.use('/user', verifyAdminToken, user);
router.use('/admin', verifyAdminToken, admin);
router.use('/category', verifyAdminToken, category);
router.use('/product', verifyAdminToken, product);
router.use('/tag', verifyAdminToken, tag);
router.use('/brand', verifyAdminToken, brand);
router.use('/module', verifyAdminToken, moduleM);
router.use('/unit', verifyAdminToken, unit);
router.use('/attribute', verifyAdminToken, attribute);
router.use('/attributeValue', verifyAdminToken, attributeValue);
router.use('/configRules', verifyAdminToken, configRule);
router.use('/order', verifyAdminToken, order);
router.use('/image', verifyAdminToken, image);
router.use('/common', verifyAdminToken, common);
router.use('/inventoryGeoname', verifyAdminToken, inventoryGeoname);
router.use('/language', verifyAdminToken, language);
router.use('/supplier', verifyAdminToken, supplier);
router.use('/inventory', verifyAdminToken, inventory);
router.use('/deliveryPointAddress', verifyAdminToken, deliveryPointAddress);
router.use('/deliveryRoute', verifyAdminToken, deliveryRoute);
router.use('/couponMaster', verifyAdminToken, couponMaster);
router.use('/deliveryRouteAgent', verifyAdminToken, deliveryRouteAgent);
router.use('/orderDeliveryAgent', verifyAdminToken, orderDeliveryAgent);
router.use('/deliveryAgent', verifyAdminToken, deliveryAgent);
router.use('/orderItemDelivery', verifyAdminToken, orderItemDelivery);
router.use('/systemSetting',  systemSetting);
router.use('/paymentHistory',  orderPaymentHistory);
router.use('/userUnavailability',  userUnavailability);

module.exports = router