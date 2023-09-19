'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_delivery_agent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      order_delivery_agent.hasOne(models.orders, { foreignKey: 'id', sourceKey: 'order_id', as: 'order_details' });
      order_delivery_agent.hasOne(models.users, { foreignKey: 'id', sourceKey: 'user_id', as: 'customer_details' });
      order_delivery_agent.hasOne(models.delivery_point_address, { foreignKey: 'id', sourceKey: 'delivery_point_address_id', as: 'pickup_address_details' });
      order_delivery_agent.hasOne(models.admins, { foreignKey: 'id', sourceKey: 'delivery_agent_id', as: 'delivery_agent_details' });
    }
  }
  order_delivery_agent.init({
    order_id: DataTypes.INTEGER,
    user_id: DataTypes.UUID,
    delivery_agent_id: DataTypes.UUID,
    delivery_status: DataTypes.STRING, //'delivered', 'not-delivered','not-set'
    delivery_point_address_id: DataTypes.INTEGER,
    delivery_date: DataTypes.DATE,
    delivery_time: DataTypes.STRING,
    remarks: DataTypes.STRING,
  }, {
    paranoid: true,
    sequelize,
    modelName: 'order_delivery_agent',
  });
  return order_delivery_agent;
};