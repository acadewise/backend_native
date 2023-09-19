const { Router } = require('express');
const orderController = require('../../../modules/orders/order/orderAdminController');
const { orderSchema, orderStatusSchema, orderAddressSchema } = require('../../../request-validator/admin/order_validator');
const { uuIdQuerySchema, orderIdQuerySchema, orderIdParamSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const router = Router();

router.post('/', orderSchema, orderController.createOrder);
router.post('/addToCart',  orderController.addToCart);
router.get('/userCart',  orderController.getUserActiveCart);
router.put('/modifyCartProduct',  orderController.modifyCartProductQuantity);
router.get('/orders', paginationQuerySchema, orderController.getAllOrder);
router.get('/orderDetail', orderIdQuerySchema, orderController.getOrder);
router.get('/user/orders', uuIdQuerySchema, paginationQuerySchema, orderController.getUserOrders);
router.put('/update/:order_id', orderIdParamSchema, orderAddressSchema, orderController.updateOrder);
router.put('/status/:order_id/:status', orderStatusSchema, orderController.updateOrderStatus);
router.post('/multiple/status/update',  orderController.updateOrderStatusMultiple);

module.exports = router;