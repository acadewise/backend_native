const { Router } = require('express');
const cartApiController = require('../../../modules/cart/user_cart/userCartApiController');
const { addProductToCartSchema, modifyProductToCartSchema } = require('../../../request-validator/api/cart_validator');
const router = Router();

router.post('/addProduct', addProductToCartSchema, cartApiController.createUserCart);
router.get('/getUserActiveCart', cartApiController.getUserActiveCart);
router.get('/getUserActiveWeeklyCart', cartApiController.getUserActiveWeeklyCart);
router.put('/modifyCartProduct', modifyProductToCartSchema, cartApiController.modifyCartProductQuantity);
router.delete('/clearCart', cartApiController.clearAllCartProducts);
router.put('/deleteCartItem', cartApiController.deleteCartItem);
router.get('/getCoupenDetails', cartApiController.getCoupenDetails);
router.post('/cloneOrderToCart/:orderId', cartApiController.cloneOrderToCart);


module.exports = router