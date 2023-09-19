'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_carts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user_carts.hasMany(models.cart_products, { foreignKey: 'cart_id', as: 'user_cart_products' });
    }
  }
  user_carts.init({
    cart_uuid: DataTypes.UUID,
    customer_id: DataTypes.UUID,
    cart_status: DataTypes.STRING,
    created_by: DataTypes.STRING,
    cart_type: DataTypes.STRING,
    virtual_order_id: DataTypes.STRING,
    shipping_pin_code: DataTypes.STRING,
    shipping_address_id: DataTypes.INTEGER,
    billing_address_id: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    coupon_code: DataTypes.STRING,
    include_reward_coin_pay: DataTypes.BOOLEAN,
    pay_reward_coin_quantity: DataTypes.DECIMAL,
    is_weekly_planner: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'user_carts',
  });
  return user_carts;
};