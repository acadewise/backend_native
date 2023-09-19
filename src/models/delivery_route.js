'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class delivery_route extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  delivery_route.init({
    title: DataTypes.STRING,
    route_description: DataTypes.TEXT,
    zip_code: DataTypes.TEXT,
    
  }, {
    paranoid: true,
    sequelize,
    modelName: 'delivery_route',
  });
  return delivery_route;
};