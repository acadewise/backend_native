'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order_payment.belongsTo(models.orders, { foreignKey: 'order_id', sourceKey: 'order_id', as: 'Order_payment_order' });
    }
  };
  order_payment.init({
    order_id: DataTypes.STRING,
    customer_id: DataTypes.UUID,
    currency: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    payment_amount: DataTypes.DECIMAL,
    advance_payment: DataTypes.DECIMAL,
    remaining_payment: DataTypes.DECIMAL,
    payment_status: DataTypes.STRING,
    refund_amount: DataTypes.DECIMAL,
    refund_note: DataTypes.TEXT,
    payment_description: DataTypes.TEXT,
    payment_detail_json: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'order_payment'
  });
  return order_payment;
};