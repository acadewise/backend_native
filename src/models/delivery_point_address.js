'use strict';
const {
  Model, cast, STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class delivery_point_address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      delivery_point_address.hasOne(models.inventory_geoname, { foreignKey: 'id', sourceKey: ('pincode'), as: 'pincode_details' });
    }
  }
  delivery_point_address.init({
    delivery_point_name:DataTypes.STRING,
    delivery_point_details:DataTypes.TEXT,
    street_address: DataTypes.TEXT,
    land_mark: DataTypes.TEXT,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    pincode: DataTypes.INTEGER,
    delivery_type: DataTypes.STRING,
  }, {
    paranoid: true,
    sequelize,
    modelName: 'delivery_point_address',
  });
  return delivery_point_address;
};