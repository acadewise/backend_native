const express = require('express');
const userRouter = require('./user');
const authRouter = require('./auth');
const categoryRouter = require('./category');
const productRouter = require('./product');
const languageRouter = require('./language');
const cartRouter = require('./cart');
const orderRouter = require('./order');
const userAddressRouter = require('./userAddress');
const userWishlist = require('./userWishlist');
const common = require('./common');
const userUnavailability = require('./userUnavailability');

const { verifyToken } = require('../../../middlewares/token_manager');

const router = express.Router()

router.use('/auth', authRouter);
router.use('/user', verifyToken, userRouter);
router.use('/category', verifyToken, categoryRouter);
router.use('/product', verifyToken, productRouter);
router.use('/language', languageRouter);
router.use('/cart', verifyToken, cartRouter);
router.use('/order', verifyToken, orderRouter);
router.use('/userAddress', verifyToken, userAddressRouter);
router.use('/wishlist', verifyToken, userWishlist);
router.use('/common', common);
router.use('/user_unavailability',verifyToken, userUnavailability);


module.exports = router