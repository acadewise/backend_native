const { Router } = require('express');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const userWishlistController = require('../../../modules/user_product_wishlist/userProductWishlistController');
const router = Router();

router.post('/add/:id', idSchema, userWishlistController.addProductToWishlist);
router.get('/wishlist', paginationQuerySchema, userWishlistController.getUserWishlist);
router.delete('/remove/:id', idSchema, userWishlistController.removeProductFromWishlist);

module.exports = router