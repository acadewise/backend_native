'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class system_settings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  system_settings.init({
    support_email: DataTypes.STRING,
    support_phone_number: DataTypes.STRING,
    banner_image: DataTypes.STRING,
    support_office_address: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'system_settings',
  });
  return system_settings;
};