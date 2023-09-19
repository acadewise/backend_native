const Order = require("../../../models").orders;
const orderItems = require("../../../models").order_items;
const orderPayment = require("../../../models").order_payment;
const orderAddress = require("../../../models").order_address;
const orderStatus = require("../../../models").order_status_history;
const productImage = require("../../../models").product_image_videos;
const orderDeliveryAgent = require("../../../models").order_delivery_agent;
const OrderItemDelivery = require("../../../models").order_item_delivery;
const { Op, Sequelize } = require("sequelize");
const OrderPaymentHistory = require("../../../models").order_payment_history;

/**
 * Get Order details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return Order.findOne({
    where: { id },
  });
}

function findByIdWithStatus(order_id, order_status) {
  return Order.findOne({
    where: {
      order_id,
      order_status,
    },
  });
}

/**
 * Get Order details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findByOrderId(order_id) {
  return Order.findOne({
    attributes: {
      exclude: ["store_id", "remote_ip", "order_item"],
    },
    where: { order_id },
    include: [
      {
        model: orderItems,
        required: true,
        as: "Order_items",
        attributes: {
          exclude: [
            "parent_item_id",
            "store_id",
            "product_type",
            "description",
            "product_detail_json",
            "custom_delivery_dates",
          ],
        },
      },
      {
        model: orderAddress,
        required: true,
        as: "Order_address",
      },
      {
        model: orderPayment,
        required: true,
        as: "Order_payment",
        attributes: {
          exclude: ["payment_detail_json"],
        },
      },
      {
        model: orderStatus,
        required: true,
        as: "Order_status_histories",
      },
      {
        model: orderDeliveryAgent,
        required: false,
        as: "order_delivery_agent",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      },
    ],
  });
}

/**
 * Get Order details by id with transaction.
 *
 * @param {Number} id
 * @param {*} t
 * @returns {Promise}
 */
function findByOrderIdT(order_id, t) {
  return Order.findOne({
    attributes: {
      exclude: ["store_id", "remote_ip", "order_item"],
    },
    where: { order_id },
    transaction: t,
    include: [
      {
        model: orderItems,
        required: true,
        as: "Order_items",
        attributes: {
          exclude: [
            "parent_item_id",
            "store_id",
            "product_type",
            "description",
            "product_detail_json",
          ],
        },
      },
      {
        model: orderAddress,
        required: true,
        as: "Order_address",
      },
      {
        model: orderPayment,
        required: true,
        as: "Order_payment",
        attributes: {
          exclude: ["payment_detail_json"],
        },
      },
      {
        model: orderStatus,
        required: true,
        as: "Order_status_histories",
      },
    ],
  });
}

/**
 * Get Order details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return Order.findAll(object);
}

/**
 * Find all the Orders
 */
function findAll(limit, offset) {
  return Order.findAll({ offset, limit });
}

/**
 * Find and count all the Orders.
 */
function findAndCountAll(limit, offset, sortOrder = "DESC", query) {
  let queryArr = [];
  let newObj = {};
  if (query.order_id) {
    newObj = { order_id: query.order_id };
    queryArr.push(newObj);
  }
  if (query.order_status) {
    newObj = { order_status: query.order_status };
    queryArr.push(newObj);
  }
  if (query.payment_type) {
    newObj = { payment_type: query.payment_type };
    queryArr.push(newObj);
  }

  if (query.from_date || query.to_date) {
    newObj = {
      createdAt: {
        [Op.between]: [
          query.from_date + "T00:00:00.000Z",
          query.to_date + "T23:59:59.999Z",
        ],
      },
    };
    queryArr.push(newObj);
  }

  return Order.findAndCountAll({
    where: {
      [Op.and]: queryArr,
    },
    attributes: {
      exclude: ["store_id", "remote_ip", "order_item"],
    },
    distinct: true,
    include: [
      {
        model: orderItems,
        required: true,
        as: "Order_items",
        attributes: {
          exclude: [
            "parent_item_id",
            "store_id",
            "product_type",
            "description",
            "product_detail_json",
          ],
        },
      },
      {
        model: orderAddress,
        required: true,
        as: "Order_address",
      },
      {
        model: orderPayment,
        required: true,
        as: "Order_payment",
        attributes: {
          exclude: ["payment_detail_json"],
        },
      },
      {
        model: orderStatus,
        required: true,
        as: "Order_status_histories",
      },
    ],
    offset,
    limit,
    order: [["createdAt", sortOrder]],
  });
}

/**
 * Create Order.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return Order.create(data);
}

/**
 * Create Order with transaction.
 *
 * @param {Object} data
 * @param {Object} t
 * @returns {Promise}
 */
function createT(data, t) {
  return Order.create(data, { transaction: t });
}

/**
 * Update Order.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return Order.update(data, { where: { id }, returning: true });
}

/**
 * Update Order with transaction.
 *
 * @param {Number} id
 * @param {Object} data
 * @param {Object} t
 * @returns {Promise}
 */
function updateT(id, data, t) {
  return Order.update(data, {
    where: { order_id: id },
    transaction: t,
    returning: true,
  });
}

function updateOrderStatus(id, data) {
  return Order.update(data, { where: { order_id: id }, returning: true });
}

/**
 * Soft delete Order.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function softDelete(id) {
  return Order.destroy({
    where: {
      id,
    },
  });
}

/**
 * get orders by user id.
 * @param {*} user_id
 */
function getUserOrder(user_id, limit, offset) {
  return Order.findAndCountAll({
    where: { customer_id: user_id },
    attributes: [
      "id",
      "order_id",
      "customer_id",
      "order_type",
      "order_status",
      "currency",
      "grand_total",
      "payment_status",
      "createdAt",
    ],
    limit,
    offset,
  });
}

/**
 * Get Order status by order_id
 *
 * @param {*} myObj
 * @param {*} t
 * @returns {Promise}
 */
function findOrderStatusByObj(myObj, t) {
  return Order.findOne({
    where: myObj,
    attributes: ["id", "order_status"],
    include: [
      {
        model: orderAddress,
        required: true,
        as: "Order_address",
      },
      {
        model: orderItems,
        required: true,
        as: "Order_items",
        attributes: ["id", "ordered_item_id", "quantity"],
      },
    ],
  });
}

/**
 *
 * @param {*} myObj
 * @param {*} limit
 * @param {*} offset
 * @param {*} sortOrder
 * @returns
 */
function findAndCountUserAllOrderWithCondition(
  myObj,
  subObj,
  limit,
  offset,
  sortOrder
) {
  return Order.findAndCountAll({
    where: myObj,
    attributes: [
      "id",
      "order_id",
      "order_status",
      "order_delivery_type",
      "expected_delivery_date",
      "createdAt",
    ],
    include: [
      {
        model: orderItems,
        required: true,
        where: subObj,
        as: "Order_items",
        attributes: [
          "id",
          "order_id",
          "product_name",
          "quantity",
          "image",
          "expected_delivery_date",
          "expected_delivery_time",
          "delivery_start_date",
          "delivery_end_date",
          "delivery_time",
          "custom_delivery_dates",
        ],
      },
    ],
    offset,
    limit,
    order: [["createdAt", sortOrder]],
  });
}

/**
 * Get Order details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findByOrderAndUserId(order_id, customer_id) {
  return Order.findOne({
    attributes: [
      "id",
      "order_id",
      "customer_id",
      "order_status",
      "currency",
      "tax_amount",
      "coupon_code",
      "discount_amount",
      "grand_total",
      "payment_type",
      "payment_status",
      "advance_payment",
      "remaining_payment",
      "order_delivery_type",
      "shipping_amount",
      "shipping_discount_amount",
      "shipping_method",
      "createdAt",
      "adjustment_amount",
    ],
    where: { order_id, customer_id },
    include: [
      {
        model: orderItems,
        required: true,
        as: "Order_items",
        where: { is_active: true },
        attributes: [
          "id",
          "order_id",
          "ordered_item_id",
          "sku",
          "is_active",
          "product_name",
          "description",
          "quantity",
          "product_delivery_type",
          "delivery_start_date",
          "delivery_end_date",
          "delivery_time",
          "discounted_price",
          "tax_amount",
          "milk_delivery_type",
          "milk_delivery_slot",
          "createdAt",
          "custom_delivery_dates",
        ],
        include: [
          {
            model: productImage,
            as: "ordered_product_image",
            require: true,
            attributes: ["id", "type", "url"],
          },
        ],
      },
      {
        model: orderAddress,
        required: true,
        as: "Order_address",
        where: {
          is_active: true,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
  });
}

function findSubscriptionOrderItems(order_id, customer_id) {
  return Order.findOne({
    attributes: [
      "id",
      "order_id",
      "customer_id",
      "order_status",
      "currency",
      "tax_amount",
      "coupon_code",
      "discount_amount",
      "grand_total",
      "payment_type",
      "payment_status",
      "advance_payment",
      "remaining_payment",
      "order_delivery_type",
      "shipping_amount",
      "shipping_discount_amount",
      "shipping_method",
      "createdAt",
    ],
    where: { order_id, customer_id },
    include: [
      {
        model: orderItems,
        required: true,
        as: "Order_items",
        where: {
          is_active: true,
          product_delivery_type: ["daily", "custom"],
        },
        attributes: [
          "id",
          "order_id",
          "ordered_item_id",
          "sku",
          "is_active",
          "product_name",
          "description",
          "quantity",
          "product_delivery_type",
          "delivery_start_date",
          "delivery_end_date",
          "delivery_time",
          "discounted_price",
          "tax_amount",
          "milk_delivery_type",
          "milk_delivery_slot",
          "createdAt",
          "custom_delivery_dates",
        ],
        include: [
          {
            model: productImage,
            as: "ordered_product_image",
            require: true,
            attributes: ["id", "type", "url"],
          },
        ],
      },
      {
        model: orderAddress,
        required: true,
        as: "Order_address",
        where: {
          is_active: true,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
  });
}

function findBySubscriptionOrderAndUserId(order_id, customer_id) {
  return Order.findOne({
    attributes: [
      "id",
      "order_id",
      "customer_id",
      "order_status",
      "currency",
      "tax_amount",
      "coupon_code",
      "discount_amount",
      "grand_total",
      "payment_type",
      "payment_status",
      "advance_payment",
      "remaining_payment",
      "order_delivery_type",
      "shipping_amount",
      "shipping_discount_amount",
      "shipping_method",
      "createdAt",
    ],
    where: { order_id, customer_id },
    include: [
      {
        model: OrderItemDelivery,
        required: true,
        as: "Order_Items_Delivery",
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "route_id",
            "createdBy",
            "updatedBy",
          ],
        },
        where: { order_type: ["SUBSCRIPTION", "CUSTOM"] },
        include: [
          {
            model: productImage,
            as: "ordered_product_image",
            require: true,
            attributes: ["id", "type", "url"],
          },
        ],
      },
      {
        model: orderAddress,
        required: true,
        as: "Order_address",
        where: {
          is_active: true,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
  });
}

/**
 * Get Order details by id with transaction.
 *
 * @param {Number} id
 * @param {*} t
 * @returns {Promise}
 */
function findByOrderIdCustomerIdT(order_id, customer_id, t) {
  return Order.findOne({
    attributes: {
      exclude: ["store_id", "remote_ip", "order_item"],
    },
    where: { order_id, customer_id },
    transaction: t,
    include: [
      {
        model: orderItems,
        required: true,
        as: "Order_items",
        attributes: {
          exclude: [
            "parent_item_id",
            "store_id",
            "product_type",
            "description",
            "product_detail_json",
          ],
        },
      },
      {
        model: orderAddress,
        required: true,
        as: "Order_address",
      },
      {
        model: orderPayment,
        required: true,
        as: "Order_payment",
        attributes: {
          exclude: ["payment_detail_json"],
        },
      },
      {
        model: orderStatus,
        required: true,
        as: "Order_status_histories",
      },
    ],
  });
}

function findAndCountUserAllWeeklyOrderWithCondition(
  myObj,
  limit,
  offset,
  sortOrder
) {
  return Order.findAndCountAll({
    where: myObj,
    attributes: ["id", "order_id", "order_status", "order_delivery_type"],
    offset,
    limit,
    order: [["id", sortOrder]],
    include: [
      {
        model: orderItems,
        required: true,
        as: "Order_items",
        attributes: {
          exclude: [
            "parent_item_id",
            "store_id",
            "product_type",
            "description",
            "product_detail_json",
          ],
        },
      },
      {
        model: orderAddress,
        required: true,
        as: "Order_address",
      },
      {
        model: orderPayment,
        required: true,
        as: "Order_payment",
        attributes: {
          exclude: ["payment_detail_json"],
        },
      },
      {
        model: orderStatus,
        required: true,
        as: "Order_status_histories",
      },
    ],
  });
}

function dueBillPaymentOrderBase(myObj, subObj, limit, offset, sortOrder) {
  return OrderPaymentHistory.findAndCountAll({
    where: myObj,
    attributes: [
      "order_id",

      [
        Sequelize.literal(
          `SUM(CASE WHEN amount_type='CR' AND payment_note='DUE' THEN "amount" ELSE 0 END)`
        ),
        "cr_due",
      ],
      [
        Sequelize.literal(
          `SUM(CASE WHEN amount_type='CR' AND payment_note='ADVANCE' THEN "amount" ELSE 0 END)`
        ),
        "cr_advance",
      ],
      [
        Sequelize.literal(
          `SUM(CASE WHEN amount_type='CR' AND payment_note='ADJUSTMENT' THEN "amount" ELSE 0 END)`
        ),
        "cr_adjustment",
      ],
      [
        Sequelize.literal(
          `SUM(CASE WHEN amount_type='CR' AND payment_note='REFUND' THEN "amount" ELSE 0 END)`
        ),
        "cr_refund",
      ],
    ],
    group: [Sequelize.col("order_payment_history.order_id")],
    // order: [['id', 'DESC']],
    offset,
    limit,
  });
}

/**
 * Get Order details for customer and order id with transaction.
 *
 * @param {Number} id
 * @param {*} t
 * @returns {Promise}
 */
function findForCustomerOrderT(order_id, customer_id, t) {
  return Order.findOne({
    attributes: {
      exclude: ["id", "order_id", "product_delivery_type"],
    },
    where: { order_id, customer_id },
    transaction: t,
    include: [
      {
        model: orderItems,
        required: true,
        as: "Order_items",
        attributes: [
          "ordered_item_id",
          "quantity",
          "is_active",
          "product_delivery_type",
          "delivery_start_date",
          "delivery_end_date",
          "delivery_time",
          "auto_renew_subscription",
        ],
      },
    ],
  });
}

/**
 * Get Order details by id
 *
 * @param {*} customer_id
 * @param {*} customer_id
 * @returns {Promise}
 */
 function findByCidOid(order_id, customer_id) {
    return Order.findOne({
        where: { order_id, customer_id },
        attributes: ['id', 'order_id', 'customer_id', 'payment_type', 'payment_status', 'grand_total', 'currency'],
        include: [
            {
                model: orderPayment,
                required: true,
                as: 'Order_payment',
                attributes: ['id', 'order_id', 'customer_id']
            }
        ]
    });
}

module.exports = {
  findById,
  findByOrderId,
  findByOrderIdT,
  findBy,
  findAll,
  findAndCountAll,
  create,
  createT,
  update,
  updateT,
  softDelete,
  getUserOrder,
  findOrderStatusByObj,
  findAndCountUserAllOrderWithCondition,
  findByOrderAndUserId,
  findByOrderIdCustomerIdT,
  findByIdWithStatus,
  updateOrderStatus,
  findAndCountUserAllWeeklyOrderWithCondition,
  findBySubscriptionOrderAndUserId,
  findSubscriptionOrderItems,
  dueBillPaymentOrderBase,
  findForCustomerOrderT,
  findByCidOid,
};
