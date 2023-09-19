const _ = require("lodash");
const moment = require("moment");
const { updateCartStatus, validateCartItem } = require("./cart_helper");
const orderDao = require("../../modules/orders/order/orderDao");
const productDao = require("../../modules/product/product/productDao");
const userCartDao = require("../../modules/cart/user_cart/userCartDao");
const orderItemDao = require("../../modules/orders/orderItem/orderItemDao");
const orderAddressDao = require("../../modules/orders/orderAddress/orderAddressDao");
const orderPaymentDao = require("../../modules/orders/orderPayment/orderPaymentDao");
const orderPaymentHistoryDao = require("../../modules/orders/orderPaymentHistory/orderPaymentHistoryDao");
const {
  updateProductQuantity,
} = require("../../helper/module_helper/product_utility");
const orderStatusHistoryDao = require("../../modules/orders/orderStatus/orderStatusHistoryDao");
const orderItemDeliveryDao = require("../../modules/orders/orderItemDelivery/orderItemDeliveryDao");
const {
  PRODUCT_QUANTITY_ADD,
  PRODUCT_QUANTITY_REMOVE,
  CART_STATUS,
} = require("../../constants/common");
const {
  DEFAULT_CURRENCY,
  APP_PREFIX,
  DELIVERY_TYPE,
  CART_TYPE,
  DELIVERY_STATUS,
  ORDER_STATUS,
  ONE_TIME_MIN_DELIVERY_DAYS,
} = require("../../config/configuration_constant");
const {
  Order,
  Order_type,
  Order_Status,
  Order_Payment_Status,
  Order_Shipping_Method,
} = require("../../constants/admin");
const inventoryDao = require("./../../modules/inventory/inventoryDao");
const {
  getSinglePaymentHistory,
  checkSinglePaymentHistory,
} = require("../../modules/orders/orderPaymentHistory/orderPaymentHistoryAdminController");
const couponMasterDao = require("../../modules/coupon_master/couponMasterDao");

/**
 * Generate order number.
 * @returns
 */
const generateOrderNumber = () => {
  let now = Date.now().toString(); // '1492341545873'
  // pad with extra random digit
  now += now + Math.floor(Math.random() * 10);
  // format
  return now.slice(4, 10) + now.slice(10, 14);
};

/**
 *
 * @param {*} req
 */
const validateOrder = async (req) => {
  try {
    const data = req.body;
    const items = data.item_details;
    const additionalData = {
      shipping_charges: data.shipping_amount,
      shipping_charges_discount: data.shipping_discount_amount,
      customer_id: data.customer_id,
      zip_code: data.delivery_pincode,
    };
    const orderItems = await validateOrderItem(items, additionalData);
    if (orderItems.errors.length > 0) {
      return orderItems;
    } else {
      const customer_id = data.customer_id;
      const currency = data.currency || DEFAULT_CURRENCY;
      const newDate = new Date();
      const expDate = newDate.setDate(newDate.getDate() + 3);
      const advancePayment = Number(data.advance_payment) || 0;
      const remainingPayment =
        Number(orderItems.order_price.grand_total) -
          Number(data.advance_payment) || 0;
      const adjustmentAmount =
        parseFloat(data.adjustment_amount) >
        parseFloat(orderItems.order_price.grand_total)
          ? orderItems.order_price.grand_total
          : data.adjustment_amount;
      const coupenDiscountAmount = await getDiscountAmountByCoupon(
        customer_id,
        data.coupon_code,
        orderItems.order_price.grand_total
      );
      const grandTotal =
        Number(orderItems.order_price.grand_total) -
          Number(coupenDiscountAmount) || 0;
      const orderData = {
        zip_code: data.delivery_pincode,
        parent_id: 0,
        customer_id,
        store_id: 0,
        remote_ip: data.remote_ip || req.ip,
        order_type: data.order_type || Order_type.ADMIN_CREATED,
        order_delivery_type: orderItems.order_price.order_delivery_type,
        order_status: Order_Status.CREATED,
        billing_address_id: data.billing_address_id,
        shipping_address_id: data.shipping_address_id,
        currency,
        tax_amount: orderItems.order_price.tax,
        shipping_amount: orderItems.order_price.shipping_charges || 0,
        shipping_discount_amount:
          orderItems.order_price.shipping_charges_discount || 0,
        coupon_code: data.coupon_code,
        discount_amount: coupenDiscountAmount,
        sub_total: orderItems.order_price.total,
        item_total: orderItems.order_price.total,
        grand_total: grandTotal,
        advance_payment: advancePayment,
        remaining_payment: remainingPayment,
        adjustment_amount: adjustmentAmount,
        payment_type: data.payment_method,
        payment_status: getPaymentStatus(data.payment_method),
        payment_details: "",
        expected_delivery_date: expDate,
        shipping_method: Order_Shipping_Method.STANDARD_DELIVERY,
        order_item: JSON.stringify(orderItems.items),
        created_by: req.adminData.id,
      };
      const payment_details = {
        customer_id,
        currency,
        payment_method: data.payment_method,
        payment_amount: orderItems.order_price.grand_total,
        advance_payment: advancePayment,
        remaining_payment: remainingPayment,
      };
      const order_status = {
        customer_id,
        action: Order_Status.CREATED,
        action_description: Order_Status.CREATED_DES,
        created_by: req.adminData.id,
      };
      const resData = {
        order_total_break: orderItems.order_price,
        order_data: orderData,
        order_items: orderItems.items,
        order_address: data.address_details,
        order_payment: payment_details,
        order_status,
      };
      return resData;
    }
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

/**
 *
 * @param {*} items
 */
const validateOrderItem = async (items, additionalData) => {
  try {
    let orderValue = 0.0,
      orderTaxAmount = 0.0,
      orderDiscountAmount = 0.0;
    let currency = DEFAULT_CURRENCY;
    const newErrorItem = [],
      newItemData = [];
    const itemIds = items.map((x) => x.item_id);
    const findObj = {
      where: { id: itemIds, is_active: true },
    };
    const dbItems = await productDao.findBy(findObj);
    const allStatus = items.map((x) => x.product_delivery_type);
    const deliveryStatus =
      allStatus[0] === DELIVERY_TYPE[1] ? CART_TYPE[0] : CART_TYPE[1];
    const checkStatus = allStatus.every((x) => x === allStatus[0]);
    const orderDeliveryType =
      checkStatus === true ? deliveryStatus : CART_TYPE[2];
    for (let item of items) {
      console.log("====>item", item);
      let orderItem = dbItems.find((x) => x.id === item.item_id);
      if (orderItem) {
        const prodValidation = await validateCartItem(
          orderItem.id,
          additionalData.zip_code,
          item,
          orderItem
        );
        if (!_.isEmpty(prodValidation)) {
          newErrorItem.push({
            item_id: item.item_id,
            error: prodValidation[0].error || Order.PROD_NO_LONGER_AVAIL,
          });
        } else {
          //let price = orderItem.is_on_sale ? orderItem.special_sale_price : orderItem.max_retail_price;
          let price = item.item_price;
          let itemQuantity = Number(item.quantity) || 1;
          orderTaxAmount = orderTaxAmount + Number(orderItem.tax);
          orderDiscountAmount = orderDiscountAmount + Number(item.discount);
          currency = item.currency || DEFAULT_CURRENCY;
          if (item.product_delivery_type === DELIVERY_TYPE[1]) {
            orderValue = orderValue + itemQuantity * Number(price);
          } else {
            const newStartDate = moment(item.delivery_start_date, "YYYY-MM-DD");
            const newEndDate = moment(item.delivery_end_date, "YYYY-MM-DD");
            const dateDiff = moment
              .duration(newEndDate.diff(newStartDate))
              .asDays();
            orderValue =
              orderValue + itemQuantity * Number(price) * (dateDiff + 1);
          }
          newItemData.push({
            customer_id: additionalData.customer_id,
            parent_item_id: 0,
            ordered_item_id: orderItem.id,
            store_id: 0,
            sku: orderItem.sku,
            is_active: true,
            product_type: orderItem.product_type,
            product_name: orderItem.name,
            description: orderItem.description,
            image: item.item_image || null,
            quantity: Number(item.quantity),
            restock_quantity: 0,
            product_delivery_type: item.product_delivery_type,
            expected_delivery_date: !_.isEmpty(item.expected_delivery_date)
              ? moment(item.expected_delivery_date, "YYYY-MM-DD h:m:s")
              : null,
            expected_delivery_time: item.expected_delivery_time || null,
            delivery_start_date: !_.isEmpty(item.delivery_start_date)
              ? moment(item.delivery_start_date, "YYYY-MM-DD h:m:s")
              : null,
            delivery_end_date: !_.isEmpty(item.delivery_end_date)
              ? moment(item.delivery_end_date, "YYYY-MM-DD h:m:s")
              : null,
            delivery_time: item.delivery_time || null,
            milk_delivery_type: item.milk_delivery_type || null,
            milk_delivery_slot: _.isEmpty(item.milk_delivery_slot)
              ? null
              : JSON.stringify(item.milk_delivery_slot),
            additional_rule_json: _.isEmpty(item.additional_rule_json)
              ? null
              : JSON.stringify(item.additional_rule_json),
            auto_renew_subscription: item.auto_renew_subscription || false,
            no_discount: item.discount ? false : true,
            // base_cost: orderItem.product_cost_price,
            // base_price: orderItem.max_retail_price,
            base_cost: orderItem.product_cost_price,
            base_price: price,
            discount_amount: item.discount,
            discounted_price: price,
            tax_amount: item.tax,
            product_detail_json: JSON.stringify(orderItem),
          });
        }
      } else {
        newErrorItem.push({
          item_id: item.item_id,
          error: Order.PROD_NO_LONGER_AVAIL,
        });
      }
    }
    const originalShippingCharge = Number(additionalData.shipping_charges);
    const shippingCharges =
      Number(additionalData.shipping_charges) -
      Number(additionalData.shipping_charges_discount); // add shipping charges condition.
    const resItems = {
      errors: newErrorItem,
      items: newItemData,
      order_price: {
        total: Math.round(orderValue),
        tax: Math.round(orderTaxAmount),
        discount: Number(orderDiscountAmount.toFixed(2)),
        shipping_charges: originalShippingCharge,
        shipping_charges_discount: additionalData.shipping_charges_discount,
        grand_total:
          Math.round(orderValue) + Math.round(orderTaxAmount) + shippingCharges,
        currency,
        order_delivery_type: orderDeliveryType,
      },
    };
    return resItems;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

/**
 *
 * @param {*} orderId
 * @param {*} data
 */
const setOrderData = async (orderId, orderData, t) => {
  try {
    orderData.order_id = orderId;
    const addOrderData = await orderDao.createT(orderData, t);
    return addOrderData;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

/**
 *
 * @param {*} orderId
 * @param {*} order_items
 */
const setOrderItems = async (orderId, order_items, t) => {
  try {
    const addItem = order_items.map((x) => {
      x.order_id = orderId;
      return x;
    });

    const addData = await orderItemDao.bulkCreate(addItem, t);
    return addData;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const setOrderItemsQuantity = async (orderId, order_items, t) => {
  const addItem = order_items.map(async (x) => {
    if (parseInt(x.product_type) === parseInt(1)) {
      // For Variable Product Only
      await setQuantityForVariableProduct(x, t);
    } else {
      // For Fixed Type Of Product Only
      await setQuantityForFixedProduct(x, t);
    }
    return x;
  });
  return addItem;
};

const setQuantityForVariableProduct = async (item_detail, t) => {
  let inventory_type = "PREDICTION";

  var startDate = moment(item_detail.delivery_start_date);
  var endDate = moment(item_detail.delivery_end_date);

  var now = startDate.clone(),
    inventoryDataArr = [];
  while (now.isSameOrBefore(endDate)) {
    let inventoryData = {
      product_id: item_detail.ordered_item_id,
      inventory_type: inventory_type,
      effective_date: now.format("YYYY-MM-DD"),
      quantity: item_detail.quantity,
    };
    let checkQuantity = inventoryDao.setProductQuantity(inventoryData, t);
    now.add(1, "days");
  }

  return true;
};

const setQuantityForFixedProduct = (item_detail, t) => {
  let inventoryData = {
    product_id: item_detail.ordered_item_id,
    quantity: item_detail.quantity,
  };
  let checkQuantity = productDao.setProductQuantity(inventoryData, t);

  return checkQuantity;
};

/**
 * Set order Address details.
 * @param {*} orderId
 * @param {*} addressData
 * @param {*} t
 * @returns
 */
const setOrderAddresses = async (orderId, addressData, t) => {
  try {
    addressData.order_id = orderId;
    const addAddress = await orderAddressDao.create(addressData, t);
    return addAddress;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

/**
 * Set order payment details.
 * @param {*} orderId
 * @param {*} payment_details
 * @param {*} t
 */
const setOrderPayment = async (orderId, payment_details, t) => {
  try {
    payment_details.order_id = orderId;
    payment_details.payment_status = getPaymentStatus(
      payment_details.payment_method
    );
    const addPayment = await orderPaymentDao.createT(payment_details, t);
    return addPayment;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

/**
 * Set order payment History details.
 * @param {*} orderId
 * @param {*} payment_details
 * @param {*} t
 */
const setOrderPaymentHistory = async (
  order_id,
  customer_id,
  payment_details,
  adjustment_amount,
  t
) => {
  try {
    let bulkInsert = [];
    let paymentHistoryObj = { order_id, customer_id };
    let duepaymentHistoryObj = { order_id, customer_id };
    let duepaymentHistoryObjAdj = { order_id, customer_id };
    let grand_total = parseFloat(payment_details.grand_total) || 0;
    let advance_payment = parseFloat(payment_details.advance_payment) || 0;

    let addPayment = [];
    let checkpayment = false;
    if (parseFloat(adjustment_amount) > 0) {
      checkpayment = await updateUserAdjustmentAmount(
        customer_id,
        order_id,
        adjustment_amount,
        t
      );

      if (checkpayment) {
        let finalAMount =
          parseFloat(adjustment_amount) > parseFloat(grand_total)
            ? grand_total
            : adjustment_amount;
        duepaymentHistoryObj.amount_type = "DR";
        duepaymentHistoryObj.payment_note = "ADJUSTMENT";
        duepaymentHistoryObj.amount = parseFloat(finalAMount);
        duepaymentHistoryObj.payment_remark =
          "Debit With Adjustment Amount In New Order";
        bulkInsert.push(duepaymentHistoryObj);
      }
    }
    if (parseFloat(grand_total) > parseFloat(adjustment_amount)) {
      //let remaingAmount = parseFloat(grand_total) - parseFloat(adjustment_amount);
      duepaymentHistoryObjAdj.amount_type = "CR";
      duepaymentHistoryObjAdj.payment_note = "DUE";
      duepaymentHistoryObjAdj.amount = grand_total || 0;
      duepaymentHistoryObjAdj.payment_remark = "Credit With Due Amount";
      bulkInsert.push(duepaymentHistoryObjAdj);
    }

    // if (payment_details.payment_type === 'COD' || payment_details.payment_type === 'PAD') {
    //     duepaymentHistoryObj.amount_type = "CR";
    //     duepaymentHistoryObj.payment_note = "DUE";
    //     duepaymentHistoryObj.amount = grand_total;
    //     duepaymentHistoryObj.payment_remark = "Credit With Due Amount";
    //     bulkInsert.push(duepaymentHistoryObj);
    // }

    if (
      payment_details.advance_payment &&
      parseFloat(payment_details.advance_payment) > 0
    ) {
      paymentHistoryObj.amount_type = "CR";
      paymentHistoryObj.payment_note = "ADVANCE";
      paymentHistoryObj.amount = advance_payment;
      paymentHistoryObj.payment_remark = "Credit With Advance Amount";
      bulkInsert.push(paymentHistoryObj);
    }

    addPayment = await orderPaymentHistoryDao.bulkCreate(bulkInsert, t);

    return addPayment;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const updateUserAdjustmentAmount = async (
  customer_id,
  order_id,
  adjustment_amount,
  t
) => {
  try {
    let req = {
      customer_id,
    };
    const getPaymentData = await checkSinglePaymentHistory(req);

    console.log("getPaymentData", getPaymentData);

    if (getPaymentData) {
      let cr_adjustment =
        (getPaymentData &&
          getPaymentData.data &&
          getPaymentData.data.cr_adjustment) ||
        0;
      let dr_adjustment =
        (getPaymentData &&
          getPaymentData.data &&
          getPaymentData.data.dr_adjustment) ||
        0;

      console.log("===>", parseFloat(cr_adjustment), parseFloat(dr_adjustment));
      let total_adjustment =
        parseFloat(cr_adjustment) - parseFloat(dr_adjustment);
      console.log("total_adjustment", total_adjustment);
      if (
        parseFloat(total_adjustment) > 0 &&
        parseFloat(adjustment_amount) <= parseFloat(total_adjustment)
      ) {
        return true;
      } else {
        return false;
      }
    }
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

/**
 * Set order status history.
 * @param {*} orderId
 * @param {*} status_history
 * @param {*} t
 */
const setOrderStatusHistory = async (orderId, status_history, t) => {
  try {
    status_history.order_id = orderId;
    const addHistory = await orderStatusHistoryDao.createT(status_history, t);
    return addHistory;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

/**
 * Get payment status on basis of payment type.
 * @param {*} payment_type
 * @returns
 */
const getPaymentStatus = (payment_type) => {
  let payment_status = Order_Payment_Status.PENDING;
  switch (payment_type) {
    case "CANCELLED":
      payment_status = Order_Payment_Status.CANCELLED;
      break;
    case "COD":
      payment_status = Order_Payment_Status.COD;
      break;
    case "DECLINED":
      payment_status = Order_Payment_Status.DECLINED;
      break;
    case "DISPUTED":
      payment_status = Order_Payment_Status.DISPUTED;
      break;
    case "INTERNAL":
      payment_status = Order_Payment_Status.INTERNAL;
      break;
    case "PAID":
      payment_status = Order_Payment_Status.PAID;
      break;
    case "PARTIAL_REFUND":
      payment_status = Order_Payment_Status.PARTIAL_REFUND;
      break;
    case "PENDING":
      payment_status = Order_Payment_Status.PENDING;
      break;
    case "REFUND_INIT":
      payment_status = Order_Payment_Status.REFUND_INIT;
      break;
    case "REFUNDED":
      payment_status = Order_Payment_Status.REFUNDED;
      break;
    case "SUBSCRIPTION":
      payment_status = Order_Payment_Status.SUBSCRIPTION;
      break;
    default:
      break;
  }
  return payment_status;
};

/**
 *
 * @param {*} customer_id
 * @param {*} coupon_code
 * @param {*} grand_total
 * @returns
 */
const getDiscountAmountByCoupon = async (
  customer_id,
  coupon_code,
  grand_total
) => {
  let coupenDetail = await couponMasterDao.findByCoupon_Code(coupon_code);
  let coupenAmount = coupenDetail?.dataValues?.coupon_amount || 0;
  return coupenAmount;
};

/**
 * Process order with respect to status.
 * @param {*} status
 */
const processOrderWithStatus = async (status, orderDetail, createdBy, t) => {
  try {
    let responseData = {};
    switch (status) {
      case Order_Status.ACCEPTED:
        const AccRes = await processOrderHistoryAndStatus(
          orderDetail,
          Order_Status.ACCEPTED,
          createdBy,
          t
        );
        const additionalData = {
          created_by: createdBy,
        };
        const response = await createItemDeliveries(
          orderDetail.order_id,
          additionalData,
          t
        );
        responseData = AccRes;
        break;
      case Order_Status.CANCELLED_BY_SELLER:
        const CansRes = await processCancelOrder(
          orderDetail,
          Order_Status.CANCELLED_BY_SELLER,
          createdBy,
          t
        );
        const resPaymenthistory = await upadteOrderPaymentHistory(
          orderDetail,
          t
        );
        responseData = CansRes;
        break;
      case Order_Status.CANCELLED_BY_USER:
        const CanuRes = await processCancelOrder(
          orderDetail,
          Order_Status.CANCELLED_BY_USER,
          createdBy,
          t
        );
        const resPaymenthistory1 = await upadteOrderPaymentHistory(
          orderDetail,
          t
        );
        responseData = CanuRes;
        break;
      case Order_Status.DELIVERED:
        const DelRes = await processOrderHistoryAndStatus(
          orderDetail,
          Order_Status.DELIVERED,
          createdBy,
          t
        );
        responseData = DelRes;
        break;
      case Order_Status.PARTIALLY_RETURNED:
        break;
      case Order_Status.RETURNED:
        break;
      case Order_Status.PARTIAL_REFUND:
        break;
      case Order_Status.FULL_REFUND:
        break;
      case Order_Status.SHIPPED:
        const ShiRes = await processOrderHistoryAndStatus(
          orderDetail,
          Order_Status.SHIPPED,
          createdBy,
          t
        );
        responseData = ShiRes;
        break;
      case Order_Status.SUBSCRIPTION_STARTED:
        const SubRes = await processOrderHistoryAndStatus(
          orderDetail,
          Order_Status.SUBSCRIPTION_STARTED,
          createdBy,
          t
        );
        responseData = SubRes;
        break;
      case Order_Status.SUBSCRIPTION_COMPLETED:
        const SubcRes = await processOrderHistoryAndStatus(
          orderDetail,
          Order_Status.SUBSCRIPTION_COMPLETED,
          createdBy,
          t
        );
        responseData = SubcRes;
        break;
      default:
        break;
    }
    return responseData;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

/**
 *
 * @param {*} orderDetail
 * @param {*} type
 * @param {*} createdBy
 * @param {*} t
 * @returns
 */
const processCancelOrder = async (orderDetail, type, createdBy, t) => {
  try {
    const CancelRes = await processOrderHistoryAndStatus(
      orderDetail,
      type,
      createdBy,
      t
    );
    if (orderDetail.order_status !== Order_Status.CREATED) {
      await manageProductQuantity(orderDetail, PRODUCT_QUANTITY_ADD, t);
    }
    return CancelRes;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

/**
 * Set Order Status.
 * @param {*} orderId
 * @param {*} orderData
 * @param {*} t
 */
const setOrderStatus = async (orderId, orderData, t) => {
  try {
    const upObj = {
      order_status: orderData.status,
      updated_by: orderData.updated_by,
    };
    const [count, update] = await orderDao.updateT(orderId, upObj, t);
    return update;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

/**
 *
 * @param {*} orderDetail
 * @param {*} newOrderStatus
 * @param {*} created_by
 * @param {*} t
 */
const processOrderHistoryAndStatus = async (
  orderDetail,
  newOrderStatus,
  created_by,
  t
) => {
  try {
    const orderId = orderDetail.order_id;
    // Process order status history.
    const { status: orderAction, description: orderActionDes } =
      getOrderStatusAndDescription(newOrderStatus);
    const historyObj = {
      customer_id: orderDetail.customer_id,
      action: orderAction,
      action_description: orderActionDes,
      is_customer_notified: false,
      created_by,
    };
    const historyRes = await setOrderStatusHistory(orderId, historyObj, t);
    // Process order status.
    const statusObj = {
      status: orderAction,
      updated_by: created_by,
    };
    const statusRes = await setOrderStatus(orderId, statusObj, t);
    return {
      status_details: statusRes,
      history_details: historyRes,
    };
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

/**
 * Get order status and description from status.
 * @param {*} orderStatus
 * @returns
 */
const getOrderStatusAndDescription = (orderStatus) => {
  let statusRes = {};
  switch (orderStatus) {
    case Order_Status.CREATED:
      statusRes = {
        status: Order_Status.CREATED,
        description: Order_Status.CREATED_DES,
      };
      break;
    case Order_Status.ACCEPTED:
      statusRes = {
        status: Order_Status.ACCEPTED,
        description: Order_Status.ACCEPTED_DES,
      };
      break;
    case Order_Status.CANCELLED_BY_SELLER:
      statusRes = {
        status: Order_Status.CANCELLED_BY_SELLER,
        description: Order_Status.CANCELLED_BY_SELLER_DES,
      };
      break;
    case Order_Status.CANCELLED_BY_USER:
      statusRes = {
        status: Order_Status.CANCELLED_BY_USER,
        description: Order_Status.CANCELLED_BY_USER_DES,
      };
      break;
    case Order_Status.SHIPPED:
      statusRes = {
        status: Order_Status.SHIPPED,
        description: Order_Status.SHIPPED_DES,
      };
      break;
    case Order_Status.DELIVERED:
      statusRes = {
        status: Order_Status.DELIVERED,
        description: Order_Status.DELIVERED_DES,
      };
      break;
    case Order_Status.PARTIALLY_RETURNED:
      statusRes = {
        status: Order_Status.PARTIALLY_RETURNED,
        description: Order_Status.PARTIALLY_RETURNED_DES,
      };
      break;
    case Order_Status.RETURNED:
      statusRes = {
        status: Order_Status.RETURNED,
        description: Order_Status.RETURNED_DES,
      };
      break;
    case Order_Status.PARTIAL_REFUND:
      statusRes = {
        status: Order_Status.PARTIAL_REFUND,
        description: Order_Status.PARTIAL_REFUND_DES,
      };
      break;
    case Order_Status.FULL_REFUND:
      statusRes = {
        status: Order_Status.FULL_REFUND,
        description: Order_Status.FULL_REFUND_DES,
      };
      break;
    case Order_Status.SUBSCRIPTION_STARTED:
      statusRes = {
        status: Order_Status.SUBSCRIPTION_STARTED,
        description: Order_Status.SUBSCRIPTION_STARTED_DES,
      };
      break;
    case Order_Status.SUBSCRIPTION_COMPLETED:
      statusRes = {
        status: Order_Status.SUBSCRIPTION_COMPLETED,
        description: Order_Status.SUBSCRIPTION_COMPLETED_DES,
      };
      break;
    default:
      break;
  }
  return statusRes;
};

/**
 *
 * @param {*} data
 * @param {*} type
 * @param {*} t
 * @returns
 */
const manageProductQuantity = async (data, type, t) => {
  try {
    const updateQuantityObj = data.Order_items.map((x) => {
      return {
        product_id: x.ordered_item_id,
        quantity: x.quantity,
        type,
      };
    });
    const updateQuantity = await updateProductQuantity(updateQuantityObj, t);
    return updateQuantity;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const upadteOrderPaymentHistory = async (data, t) => {
  const orderId = data?.order_id;
  const attributes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };
  let obj = {
    order_id: orderId,
  };

  const paymentHistory = await orderPaymentHistoryDao.findOrderPaymentHistory(
    obj,
    attributes
  );

  let newArr = [];
  let res = {};
  paymentHistory &&
    paymentHistory.length > 0 &&
    paymentHistory.map((item, index) => {
      let newObj = {
        customer_id: item.customer_id,
        order_id: item.order_id,
        amount: item.amount,
        amount_type: item.amount_type === "CR" ? "DR" : "CR",
        payment_note: item.payment_note,
        payment_remark: "Revised Item Values",
      };

      newArr.push(newObj);
    });
  if (newArr.length > 0) {
    res = orderPaymentHistoryDao.bulkCreate(newArr);
  }

  return res;
};

const createOrderFromCart = async (cartData, additionalData, t) => {
  try {
    const result = {};
    const validateCart = await validateCartForCheckout(
      cartData.user_cart_products,
      additionalData
    );
    if (validateCart.errors.length > 0) {
      result.errors = validateCart.errors;
      result.is_error = true;
      return result;
    }
    const processOrder = await processCartOrder(
      validateCart.cart_details,
      additionalData,
      t
    );
    return processOrder;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const validateCartForCheckout = async (cartProducts, additionalData) => {
  try {
    const errors = [];
    const productDetail = [];
    let grand_total = 0.0,
      sub_total = 0.0;
    for (let item of cartProducts) {
      if (!_.isEmpty(item.cart_product_detail)) {
        const prodValidation = await validateCartItem(
          item.product_id,
          additionalData.shipping_pin_code,
          item
        );
        if (!_.isEmpty(prodValidation)) {
          const newError = {
            product_id: item.product_id,
            error: Order.PROD_NO_LONGER_AVAIL,
          };
          errors.push(newError);
        } else {
          let purchasePrice;
          const currQuant = Number(item.quantity);
          const currPrice = item.cart_product_detail.is_on_sale
            ? Number(item.cart_product_detail.special_sale_price)
            : Number(item.cart_product_detail.max_retail_price);
          if (item.product_delivery_type === DELIVERY_TYPE[0]) {
            const newStartDate = moment(item.delivery_start_date, "YYYY-MM-DD");
            const newEndDate = moment(item.delivery_end_date, "YYYY-MM-DD");
            const dateDiff = moment
              .duration(newEndDate.diff(newStartDate))
              .asDays();
            purchasePrice = currPrice * currQuant * (dateDiff + 1);
          } else if (item.product_delivery_type === DELIVERY_TYPE[1]) {
            purchasePrice = currPrice * currQuant;
          } else {
            const daysCount = item.custom_delivery_dates.length;
            purchasePrice = currPrice * currQuant * daysCount;
          }
          sub_total += Number(purchasePrice);
          const proDetail = {
            customer_id: additionalData.customer_id,
            product_id: item.cart_product_detail.id,
            product_name: item.cart_product_detail.name,
            sku: item.cart_product_detail.sku,
            quantity: currQuant,
            image: item.cart_product_detail.product_images[0].url
              ? item.cart_product_detail.product_images[0].url
              : null,
            price: currPrice,
            ordered_item_id: item.cart_product_detail.id,
            parent_item_id: 0,
            store_id: 0,
            is_active: true,
            product_type: item.cart_product_detail.product_type,
            description: item.cart_product_detail.description,
            restock_quantity: 0,
            product_delivery_type: item.product_delivery_type,
            expected_delivery_date: item.expected_delivery_date || null,
            expected_delivery_time: item.expected_delivery_time || null,
            delivery_start_date: item.delivery_start_date || null,
            delivery_end_date: item.delivery_end_date || null,
            delivery_time: item.delivery_time || null,
            milk_delivery_type: item.milk_delivery_type || null,
            milk_delivery_slot: _.isEmpty(item.milk_delivery_slot)
              ? null
              : JSON.stringify(item.milk_delivery_slot),
            additional_rule_json: _.isEmpty(item.additional_rule_json)
              ? null
              : JSON.stringify(item.additional_rule_json),
            auto_renew_subscription: item.auto_renew_subscription || false,
            no_discount: item.cart_product_detail.is_on_sale ? false : true,
            base_cost: item.cart_product_detail.product_cost_price,
            base_price: item.cart_product_detail.max_retail_price,
            discount_amount: item.cart_product_detail.discount,
            discounted_price: currPrice,
            tax_amount: item.cart_product_detail.tax,
            product_detail_json: JSON.stringify(item.cart_product_detail),
            custom_delivery_dates: item.custom_delivery_dates || null,
          };
          productDetail.push(proDetail);
        }
      } else {
        const newError = {
          product_id: item.product_id,
          error: Order.PROD_NO_LONGER_AVAIL,
        };
        errors.push(newError);
      }
    }
    const coupon_discount = await getDiscountAmountByCoupon(
      additionalData.customer_id,
      additionalData.coupon_code,
      sub_total
    );
    const shippingCharges = getShippingCharges(sub_total);
    grand_total =
      sub_total +
      (shippingCharges.shipping_charges -
        shippingCharges.shipping_charges_discount) -
      Number(coupon_discount);
    const finalObj = {
      errors,
      cart_details: {
        products: productDetail,
        bill_details: {
          grand_total,
          sub_total,
          delivery_fees: shippingCharges.shipping_charges,
          delivery_fees_discount: shippingCharges.shipping_charges_discount,
          item_total: sub_total,
          tax_amount: 0,
          advance_payment: 0,
          remaining_payment: 0,
          coupon_discount_amount: Number(coupon_discount),
        },
        to_pay: {
          reward_coins: additionalData.pay_reward_coin_quantity || 0,
          sub_total: grand_total,
          available_balance: 0.0,
        },
        grand_total,
        currency: additionalData.currency,
        order_delivery_type: additionalData.cart_type,
        is_weekly_planner: additionalData.is_weekly_planner || false,
      },
    };
    return finalObj;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

/**
 *
 * @param {*} subTotal
 * @returns
 */
const getShippingCharges = (subTotal) => {
  try {
    const stdShippingCharge = Order.SHIPPING_CHARGE;
    const shippingChargeDiscount = Order.SHIPPING_CHARGE;
    return {
      shipping_charges: Number(stdShippingCharge),
      shipping_charges_discount: Number(shippingChargeDiscount),
    };
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const processCartOrder = async (cartData, additionalData, t) => {
  try {
    const orderId = generateOrderNumber();
    const coupenDiscountAmount = await getDiscountAmountByCoupon(
      additionalData.customer_id,
      additionalData.coupon_code,
      cartData.bill_details.grand_total
    );
    const orderData = {
      zip_code: additionalData.shipping_pin_code,
      parent_id: 0,
      customer_id: additionalData.customer_id,
      store_id: 0,
      remote_ip: additionalData.remote_ip || null,
      order_type: Order_type.USER_CREATED,
      order_delivery_type: additionalData.cart_type,
      order_status: Order_Status.CREATED,
      billing_address_id: additionalData.billing_address_id,
      shipping_address_id: additionalData.shipping_address_id,
      currency: cartData.currency,
      tax_amount: cartData.bill_details.tax_amount,
      shipping_amount: cartData.bill_details.delivery_fees || 0,
      shipping_discount_amount:
        cartData.bill_details.delivery_fees_discount || 0,
      coupon_code: additionalData.coupon_code,
      sub_total: cartData.bill_details.sub_total,
      item_total: cartData.bill_details.item_total,
      discount_amount: coupenDiscountAmount,
      grand_total: cartData.bill_details.grand_total,
      advance_payment: cartData.bill_details.advance_payment,
      remaining_payment: cartData.bill_details.remaining_payment,
      adjustment_amount: additionalData.adjustment_amount || 0,
      payment_type: additionalData.payment_method,
      payment_status: getPaymentStatus(additionalData.payment_method),
      payment_details: "",
      expected_delivery_date: null,
      shipping_method: Order_Shipping_Method.STANDARD_DELIVERY,
      order_item: JSON.stringify(cartData.products),
      created_by: additionalData.customer_id,
      is_weekly_planner: additionalData.is_weekly_planner || false,
    };
    const order = await setOrderData(orderId, orderData, t);
    const orderItem = await setOrderItems(orderId, cartData.products, t);
    const addressDetails = additionalData.address_details;
    const orderAddress = await setOrderAddresses(orderId, addressDetails, t);
    const paymentDetails = {
      customer_id: additionalData.customer_id,
      currency: cartData.currency,
      payment_method: additionalData.payment_method,
      payment_amount: cartData.bill_details.grand_total,
      advance_payment: cartData.bill_details.advance_payment,
      remaining_payment: cartData.bill_details.remaining_payment,
    };
    const orderPayment = await setOrderPayment(orderId, paymentDetails, t);
    //console.log("===>orderPayment",orderPayment)
    const payemntObj = {
      grand_total: orderPayment.payment_amount,
      advance_payment: orderPayment.advance_payment,
    };
    const orderPaymentHistory = await setOrderPaymentHistory(
      orderId,
      additionalData.customer_id,
      payemntObj,
      additionalData.adjustment_amount,
      t
    );
    const orderStatus = {
      customer_id: additionalData.customer_id,
      action: Order_Status.CREATED,
      action_description: Order_Status.CREATED_DES,
      created_by: additionalData.customer_id,
    };
    const orderStatusHistory = await setOrderStatusHistory(
      orderId,
      orderStatus,
      t
    );
    // change cart status.
    const cartStatus = CART_STATUS[4];
    const updateCart = await updateCartStatus(
      additionalData.cart_uuid,
      cartStatus,
      t
    );
    return order;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

/**
 *
 * @param {*} order_id
 * @param {*} orderDetail
 * @param {*} addressDetails
 * @param {*} t
 * @returns
 */
const processUpdateOrderAddress = async (
  order_id,
  orderDetail,
  addressDetails,
  t
) => {
  try {
    const unchangeableStatus = [
      Order_Status.SHIPPED,
      Order_Status.DELIVERED,
      Order_Status.CANCELLED_BY_SELLER,
      Order_Status.CANCELLED_BY_USER,
      Order_Status.RETURNED,
      Order_Status.PARTIALLY_RETURNED,
      Order_Status.FULL_REFUND,
      Order_Status.PARTIAL_REFUND,
    ];
    if (unchangeableStatus.includes(orderDetail.order_status)) {
      return {
        error: `You can't change your address of order with status ${orderDetail.order_status}!`,
      };
    }
    const validationError = [];
    for (let item of orderDetail.Order_items) {
      const prodValidation = await validateCartItem(
        item.ordered_item_id,
        addressDetails.delivery_pincode,
        item
      );
      if (!_.isEmpty(prodValidation)) {
        validationError.push(prodValidation);
      }
    }
    if (!_.isEmpty(validationError)) {
      return {
        error: `Address can not be changed as some item inside this order can not be shipped on given location!`,
      };
    }
    const oldAddress = orderDetail.Order_address;
    if (!_.isEmpty(oldAddress)) {
      const updateObj = {
        is_active: false,
      };
      await orderAddressDao.updateByOrderIdT(order_id, updateObj, t);
    }
    const orderUpdateObj = {
      zip_code: addressDetails.delivery_pincode,
      billing_address_id: addressDetails.billing_address_id,
      shipping_address_id: addressDetails.shipping_address_id,
    };
    delete addressDetails.address_details.id;
    const newUpdateAddress = addressDetails.address_details;
    const [count, orderUpdate] = await orderDao.updateT(
      order_id,
      orderUpdateObj,
      t
    );
    const orderAddressUpdate = await setOrderAddresses(
      order_id,
      newUpdateAddress,
      t
    );
    return {
      error: null,
      order_details: orderUpdate,
      order_address: orderAddressUpdate,
    };
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const createItemDeliveries = async (order_id, additionalData, t) => {
  try {
    const createObj = [];
    const itemIds = [];
    const orderData = await orderItemDao.deliveryItemsDetails(order_id, t);
    if (!_.isEmpty(orderData)) {
      for (let item of orderData) {
        itemIds.push(item.id);
        const crDel = await createDeliveries(
          item,
          additionalData,
          t,
          item.product_delivery_type
        );
        createObj.push(crDel);
      }
    }
    if (!_.isEmpty(itemIds)) {
      const myObj = {
        is_added_to_delivery: true,
      };
      await orderItemDao.updateT(itemIds, myObj, t);
    }
    return createObj;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const createDeliveries = async (itemData, additionalData, t, type) => {
  try {
    const createArr = [];
    const createObj = {
      order_id: itemData.order_id,
      customer_id: itemData.customer_id,
      zip_code: itemData.Order_item_order.zip_code,
      delivery_agent_id: null,
      delivery_status: DELIVERY_STATUS[0],
      delivery_point_address_id: 0,
      delivery_address: !_.isEmpty(itemData.Order_item_order.Order_address[0])
        ? JSON.stringify(itemData.Order_item_order.Order_address[0])
        : null,
      delivery_date: "",
      delivery_time: itemData.expected_delivery_time || null,
      product_id: itemData.ordered_item_id,
      product_sku: itemData.sku,
      product_name: itemData.product_name,
      product_image: itemData.image || null,
      quantity: itemData.quantity,
      payment_status: itemData.Order_item_order.payment_status,
      amount_to_be_collected: itemData.discounted_price || 0.0,
      route_id: 0,
      order_type: "",
      order_status: itemData.Order_item_order.order_status,
      category_id: itemData.order_item_category.category_id || 0,
      delivery_type: Order_Shipping_Method.STANDARD_DELIVERY,
      variation_type: itemData.variation_type || null,
      variation_value: itemData.variation_value || null,
      remark: null,
      createdBy: additionalData.created_by,
    };
    if (type === DELIVERY_TYPE[0]) {
      const startDate = itemData.delivery_start_date;
      const endDate = itemData.delivery_end_date;
      if (startDate && endDate) {
        const newStartDate = moment(startDate, "YYYY-MM-DD");
        const newEndDate = moment(endDate, "YYYY-MM-DD");
        const dateDiff = moment
          .duration(newEndDate.diff(newStartDate))
          .asDays();
        for (let i = 0; i <= dateDiff; i++) {
          const customObj = JSON.parse(JSON.stringify(createObj));
          customObj.order_type = CART_TYPE[1];
          customObj.delivery_date =
            moment(newStartDate, "YYYY-MM-DD").add(i, "days") || null;
          createArr.push(customObj);
        }
      }
    } else if (type === DELIVERY_TYPE[1]) {
      createObj.delivery_date =
        itemData.expected_delivery_date ||
        moment(itemData.createdAt, "YYYY-MM-DD").add(
          ONE_TIME_MIN_DELIVERY_DAYS,
          "days"
        );
      createObj.order_type = CART_TYPE[0];
      createArr.push(createObj);
    } else {
      const daysArr = itemData.custom_delivery_dates;
      for (let i = 0; i < daysArr.length; i++) {
        const customObj = JSON.parse(JSON.stringify(createObj));
        customObj.order_type = CART_TYPE[3];
        customObj.delivery_date = moment(daysArr[i], "YYYY-MM-DD") || null;
        createArr.push(customObj);
      }
    }
    let createData = {};
    if (!_.isEmpty(createArr)) {
      createData = await orderItemDeliveryDao.bulkCreateOrderItemDeliveryWT(
        createArr
      );
    }
    return createData;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const updateCartStatusItem = async (cart_uuid, cart_status, t) => {
  try {
    const Obj = {
      where: {
        cart_uuid,
      },
      transaction: t,
    };
    const cartDetail = await userCartDao.getCartByObj(Obj);
    if (cartDetail) {
      const upObj = {
        cart_status,
      };
      const [count, update] = await userCartDao.updateT(
        cartDetail.id,
        upObj,
        t
      );
      return update;
    } else {
      throw new Error("Cart details not found!");
    }
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const updateOrderStatusAfterDelivery = async (orderDetails, updated_by) => {
  try {
    const upObj = {
      order_status: ORDER_STATUS[5],
      updated_by,
    };
    const orderId = orderDetails.order_id;
    if (orderDetails.order_delivery_type === CART_TYPE[0]) {
        const deliveryCheck = await orderItemDeliveryDao.findByOrderIdAndDeliveryStatus(orderId);
        if (_.isEmpty(deliveryCheck)) {
            await orderDao.update(orderDetails.id, upObj);
        }
    } else {
      const deliveryList =
        await orderItemDeliveryDao.findByOrderIdAndDeliveryDate(orderId);
      if (_.isEmpty(deliveryList)) {
        upObj.order_status =
          orderDetails.order_delivery_type === CART_TYPE[1]
            ? ORDER_STATUS[7]
            : ORDER_STATUS[8];
        await orderDao.update(orderDetails.id, upObj);
      }
    }
    return;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
  return;
};

/**
 *
 * @param {*} payload
 * @param {*} t
 * @returns
 */
const updateOrderPaymentStatusHelper = async (payload, t) => {
    try {
        const paymentMtd = payload.paymentMethod;
        const paytmStatus = payload?.paymentDetails?.body?.resultInfo?.resultStatus || null;
        const upObj1 = {
            payment_type: paymentMtd,
            payment_status: 'FAILED',
            payment_details: JSON.stringify(payload.paymentDetails),
            updatedBy: payload.customerId
        }
        const upObj2 = {
            payment_type: paymentMtd,
            payment_status: 'FAILED',
            payment_detail_json: JSON.stringify(payload.paymentDetails),
        }
        const addObj = {
            order_id: payload.orderDetails.order_id,
            customer_id: payload.orderDetails.customer_id,
            payment_mode: paymentMtd
        }

        if (paymentMtd === 'PAYTM') {
            switch (paytmStatus) {
                case 'TXN_SUCCESS':
                    upObj1.payment_status = 'PAID';
                    upObj2.payment_status = 'PAID';
                    addObj.amount = payload.orderDetails.grand_total;
                    addObj.amount_type = 'CR';
                    addObj.payment_note = 'ADVANCE';
                    addObj.payment_remark = 'Credit with Advance Amount';
                    addObj.transaction_remark = 'Advance';
                    //add payment history
                    await orderPaymentHistoryDao.createT(addObj, t);
                    break;
                case 'TXN_FAILURE':
                    upObj1.payment_status = 'FAILED';
                    upObj2.payment_status = 'FAILED';
                    break;
                default:
                    break;
            }
        } else if(paymentMtd === 'COD') {
            upObj1.payment_status = 'PENDING';
            upObj2.payment_status = 'PENDING';
            addObj.amount = payload.orderDetails.grand_total;
            addObj.amount_type = 'CR';
            addObj.payment_note = 'DUE';
            addObj.payment_remark = 'Credit with Due Amount';
            addObj.transaction_remark = 'due';
            //add payment history
            await orderPaymentHistoryDao.createT(addObj, t);
        }
        // update Order status
        await orderDao.updateT(payload.orderDetails.order_id, upObj1, t);

        //update Order Payments
        await orderPaymentDao.updateT(payload.orderDetails.Order_payment.id, upObj2, t);
        return;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
};

module.exports = {
  generateOrderNumber,
  validateOrder,
  validateOrderItem,
  setOrderData,
  setOrderItems,
  setOrderAddresses,
  setOrderPayment,
  setOrderStatusHistory,
  getPaymentStatus,
  getDiscountAmountByCoupon,
  processOrderWithStatus,
  setOrderStatus,
  processOrderHistoryAndStatus,
  getOrderStatusAndDescription,
  manageProductQuantity,
  createOrderFromCart,
  validateCartForCheckout,
  getShippingCharges,
  processUpdateOrderAddress,
  createItemDeliveries,
  createDeliveries,
  setQuantityForVariableProduct,
  setQuantityForFixedProduct,
  setOrderItemsQuantity,
  setOrderPaymentHistory,
  updateCartStatusItem,
  updateUserAdjustmentAmount,
  updateOrderStatusAfterDelivery,
  updateOrderPaymentStatusHelper,
};
