'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      orders.hasMany(models.order_items, { foreignKey: 'order_id', sourceKey: 'order_id', as: 'Order_items' });
      orders.hasMany(models.order_address, { foreignKey: 'order_id', sourceKey: 'order_id', as: 'Order_address' });
      orders.hasOne(models.order_payment, { foreignKey: 'order_id', sourceKey: 'order_id', as: 'Order_payment' });
      orders.hasMany(models.order_status_history, { foreignKey: 'order_id', sourceKey: 'order_id', as: 'Order_status_histories' });
      orders.hasOne(models.order_delivery_agent, { foreignKey: 'order_id', sourceKey: 'id', as: 'order_delivery_agent' });
      orders.hasMany(models.order_item_delivery, { foreignKey: 'order_id', sourceKey: 'order_id', as: 'Order_Items_Delivery' });
    }
  };
  orders.init({
    zip_code: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
    order_id: DataTypes.STRING,
    customer_id: DataTypes.UUID,
    store_id: DataTypes.INTEGER,
    remote_ip: DataTypes.STRING,
    order_type: DataTypes.STRING,
    order_delivery_type: DataTypes.STRING,
    order_status: DataTypes.STRING,
    order_status_description: DataTypes.TEXT,
    billing_address_id: DataTypes.INTEGER,
    shipping_address_id: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    tax_amount: DataTypes.DECIMAL,
    shipping_amount: DataTypes.DECIMAL,
    shipping_discount_amount: DataTypes.DECIMAL,
    coupon_code: DataTypes.STRING,
    discount_amount: DataTypes.DECIMAL,
    sub_total: DataTypes.DECIMAL,
    item_total: DataTypes.DECIMAL,
    advance_payment: DataTypes.DECIMAL,
    remaining_payment: DataTypes.DECIMAL,
    adjustment_amount: DataTypes.DECIMAL,
    grand_total: DataTypes.DECIMAL,
    payment_type: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    payment_details: DataTypes.JSON,
    expected_delivery_date: DataTypes.DATE,
    shipping_method: DataTypes.STRING,
    order_item: DataTypes.JSON,
    created_by: DataTypes.UUID,
    updated_by: DataTypes.UUID,
    is_weekly_planner: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'orders'
  });
  return orders;
};