'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class inventory_geoname extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  inventory_geoname.init({
    country_code: DataTypes.STRING,
    zip_code: DataTypes.STRING,
    region: DataTypes.STRING,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    zip_description: DataTypes.TEXT,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'inventory_geoname',
  });
  return inventory_geoname;
};