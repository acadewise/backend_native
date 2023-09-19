'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_payment_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      order_payment_history.hasOne(models.users, { foreignKey: 'id', sourceKey: 'customer_id', as: 'customer_details' });
    }
  }
  order_payment_history.init({
    order_id: DataTypes.STRING,
    customer_id: DataTypes.UUID,
    amount_type: DataTypes.STRING,
    payment_note: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    payment_remark: DataTypes.STRING,
    payment_mode: DataTypes.STRING,
    transaction_remark: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'order_payment_history',
  });
  return order_payment_history;
};