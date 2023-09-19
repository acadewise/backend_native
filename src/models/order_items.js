'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order_items.belongsTo(models.orders, { foreignKey: 'order_id', targetKey: 'order_id', as: 'Order_item_order' });
      order_items.hasOne(models.product_image_videos, { foreignKey: 'product_id', sourceKey: 'ordered_item_id', as: 'ordered_product_image' });
      order_items.hasOne(models.product_category, { foreignKey: 'product_id', sourceKey: 'ordered_item_id', as: 'order_item_category' });
    }
  };
  order_items.init({
    order_id: DataTypes.STRING,
    customer_id: DataTypes.UUID,
    parent_item_id: DataTypes.INTEGER,
    ordered_item_id: DataTypes.INTEGER,
    store_id: DataTypes.INTEGER,
    sku: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    product_type: DataTypes.SMALLINT,
    product_name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    quantity: DataTypes.DECIMAL,
    restock_quantity: DataTypes.DECIMAL,
    variation_type: DataTypes.STRING,
    variation_value: DataTypes.STRING,
    product_delivery_type: DataTypes.STRING,
    expected_delivery_date: DataTypes.DATE,
    expected_delivery_time: DataTypes.STRING,
    delivery_start_date: DataTypes.DATE,
    delivery_end_date: DataTypes.DATE,
    delivery_time: DataTypes.STRING,
    milk_delivery_type: DataTypes.ARRAY(DataTypes.STRING),
    milk_delivery_slot: DataTypes.JSON,
    additional_rule_json: DataTypes.JSON,
    is_added_to_delivery: DataTypes.BOOLEAN,
    auto_renew_subscription: DataTypes.BOOLEAN,
    no_discount: DataTypes.BOOLEAN,
    base_cost: DataTypes.DECIMAL,
    base_price: DataTypes.DECIMAL,
    discount_amount: DataTypes.DECIMAL,
    discounted_price: DataTypes.DECIMAL,
    tax_amount: DataTypes.DECIMAL,
    product_detail_json: DataTypes.JSON,
    custom_delivery_dates: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'order_items'
  });
  return order_items;
};