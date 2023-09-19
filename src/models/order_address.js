'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order_address.belongsTo(models.orders, { foreignKey: 'order_id', sourceKey: 'order_id', as: 'Order_address_order' });
    }
  };
  order_address.init({
    order_id: DataTypes.STRING,
    billing_address_type: DataTypes.STRING,
    billing_name: DataTypes.STRING,
    billing_email: DataTypes.STRING,
    billing_phone_number: DataTypes.STRING,
    billing_street_address: DataTypes.TEXT,
    billing_landmark: DataTypes.TEXT,
    billing_city: DataTypes.STRING,
    billing_state: DataTypes.STRING,
    billing_country: DataTypes.STRING,
    billing_zip_code: DataTypes.STRING,
    shipping_address_type: DataTypes.STRING,
    shipping_name: DataTypes.STRING,
    shipping_email: DataTypes.STRING,
    shipping_phone_number: DataTypes.STRING,
    shipping_street_address: DataTypes.TEXT,
    shipping_landmark: DataTypes.TEXT,
    shipping_city: DataTypes.STRING,
    shipping_state: DataTypes.STRING,
    shipping_country: DataTypes.STRING,
    shipping_zip_code: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'order_address'
  });
  return order_address;
};