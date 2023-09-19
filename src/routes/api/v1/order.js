const { Router } = require('express');
const orderApiController = require('../../../modules/orders/order/orderApiController');
const { paginationQuerySchema, orderIdParamSchema, zipCodeParamSchema, dateQuerySchema } = require('../../../request-validator/admin/common_validator');
const { getCheckoutSchema, createOrderFromCartSchema, orderTypeSchema, cancelDeliverySchema, paymentStatusSchema } = require('../../../request-validator/api/order_validator');
const { orderAddressSchema } = require('../../../request-validator/admin/order_validator');
const router = Router();

router.post('/getCheckout', getCheckoutSchema, orderApiController.getCheckoutDetails);
router.post('/create', createOrderFromCartSchema, orderApiController.createUserOrder);
router.get('/myOrders/:type/:subType', orderTypeSchema, paginationQuerySchema, orderApiController.getAllOrders);
router.get('/singleOrder/:order_id', orderIdParamSchema, orderApiController.getOrderDetail);
router.get('/cancelOrder/:order_id', orderIdParamSchema, orderApiController.cancelCustomerOrder);
router.put('/updateAddress/:order_id', orderIdParamSchema, orderAddressSchema, orderApiController.updateCustomerOrderAddress);
router.get('/getCalenderOrderList/:zip_code', zipCodeParamSchema, dateQuerySchema, orderApiController.getCalenderOrders);
router.get('/myWeeklyOrders/:type/:subType', orderTypeSchema, paginationQuerySchema, orderApiController.getAllWeeklyOrders);
router.get('/subscription/singleOrder/:order_id', orderIdParamSchema, orderApiController.getSubscriptionOrderDetail);
router.post('/cancelDelivery', cancelDeliverySchema, orderApiController.cancelOrderDelivery);
router.put('/updatePaymentStatus/:order_id', orderIdParamSchema, paymentStatusSchema, orderApiController.updateOrderPaymentStatus);
router.get('/createTxnTokenPayTm/:order_id', orderIdParamSchema, orderApiController.createOrderTxnToken);


module.exports = router