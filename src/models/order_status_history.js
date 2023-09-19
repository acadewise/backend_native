'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_status_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order_status_history.belongsTo(models.orders, { foreignKey: 'order_id', sourceKey: 'order_id', as: 'Order_history_order' });
    }
  };
  order_status_history.init({
    order_id: DataTypes.STRING,
    customer_id: DataTypes.UUID,
    action: DataTypes.STRING,
    action_description: DataTypes.TEXT,
    extra: DataTypes.TEXT,
    is_customer_notified: DataTypes.BOOLEAN,
    created_by: DataTypes.UUID,
    updated_by: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'order_status_history',
    tableName: 'order_status_history'
  });
  return order_status_history;
};