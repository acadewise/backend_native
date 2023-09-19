const OrderModel = require("../../../models").orders;
const OrderItem = require("../../../models").order_items;
const OrderAddress = require("../../../models").order_address;
const productCategory = require("../../../models").product_category;

/**
 * Get OrderItem details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return OrderItem.findOne({
    where: { id },
  });
}

/**
 * Get OrderItem details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return OrderItem.findAll(object);
}

/**
 * Find all the OrderItems
 */
function findAll(offset, limit) {
  return OrderItem.findAll({ offset, limit });
}

/**
 * Create OrderItem.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return OrderItem.create(data);
}

/**
 * Bulk create OrderItem.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function bulkCreate(data, t) {
  return OrderItem.bulkCreate(data, { transaction: t });
}

/**
 * Update OrderItem.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return OrderItem.update(data, { where: { id }, returning: true });
}

/**
 * Update OrderItem with transaction.
 *
 * @param {Number} id
 * @param {Object} data
 * @param {Object} t
 * @returns {Promise}
 */
function updateT(ids, data, t) {
  return OrderItem.update(data, {
    where: { id: ids },
    transaction: t,
    returning: true,
  });
}

/**
 *
 * @param {*} order_id
 * @param {*} t
 * @returns
 */
function deliveryItemsDetails(order_id, t) {
  return OrderItem.findAll({
    where: { order_id, is_active: true, is_added_to_delivery: false },
    transaction: t,
    attributes: [
      "id",
      "order_id",
      "customer_id",
      "expected_delivery_date",
      "expected_delivery_time",
      "product_delivery_type",
      "delivery_start_date",
      "delivery_end_date",
      "ordered_item_id",
      "sku",
      "product_name",
      "image",
      "base_price",
      "quantity",
      "variation_type",
      "variation_value",
      "createdAt",
      "custom_delivery_dates",
      "discounted_price",
    ],
    include: [
      {
        model: OrderModel,
        as: "Order_item_order",
        required: true,
        attributes: ["id", "zip_code", "order_status", "payment_status"],
        include: [
          {
            model: OrderAddress,
            as: "Order_address",
            where: {
              is_active: true,
            },
            required: true,
            attributes: [
              "shipping_name",
              "shipping_email",
              "shipping_phone_number",
              "shipping_street_address",
              "shipping_landmark",
              "shipping_city",
              "shipping_country",
              "shipping_zip_code",
            ],
          },
        ],
      },
      {
        model: productCategory,
        as: "order_item_category",
        required: true,
        attributes: ["category_id"],
      },
    ],
  });
}

module.exports = {
  findById,
  findBy,
  findAll,
  create,
  bulkCreate,
  update,
  updateT,
  deliveryItemsDetails,
};
