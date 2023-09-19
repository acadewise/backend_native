'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class delivery_route_agent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      delivery_route_agent.hasMany(models.admins, { foreignKey: 'id', sourceKey: 'agent_id', as: 'agent_details' });
      delivery_route_agent.hasOne(models.delivery_route, { foreignKey: 'id', sourceKey: 'route_id', as: 'route_details' });
    }
  }
  delivery_route_agent.init({
    agent_id: DataTypes.UUID,
    route_id: DataTypes.INTEGER
  }, {
    paranoid: true,
    sequelize,
    modelName: 'delivery_route_agent',
  });
  return delivery_route_agent;
};