'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart_products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      cart_products.hasOne(models.products, { foreignKey: 'id', sourceKey: 'product_id', as: 'cart_product_detail' });
    }
  }
  cart_products.init({
    cart_id: DataTypes.INTEGER,
    cart_uuid: DataTypes.UUID,
    product_delivery_type: DataTypes.STRING,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.FLOAT,
    is_active: DataTypes.BOOLEAN,
    product_variation_type: DataTypes.STRING,
    product_variation_value: DataTypes.STRING,
    product_coupon_code: DataTypes.STRING,
    expected_delivery_date: DataTypes.DATE,
    expected_delivery_time: DataTypes.STRING,
    delivery_start_date: DataTypes.DATE,
    delivery_end_date: DataTypes.DATE,
    delivery_time_slot: DataTypes.TIME,
    auto_renew_subscription: DataTypes.BOOLEAN,
    milk_delivery_type: DataTypes.ARRAY(DataTypes.STRING),
    milk_delivery_slot: DataTypes.JSON,
    additional_rule_json: DataTypes.JSON,
    custom_delivery_dates: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'cart_products',
  });
  return cart_products;
};