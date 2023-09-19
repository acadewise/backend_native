'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  supplier.init({
    owner_name: DataTypes.STRING,
    bussiness_name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    supplier_email: DataTypes.STRING,
    gst_number: DataTypes.STRING,
    street_address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    landmark: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,

  }, {
    paranoid: true,
    sequelize,
    modelName: 'supplier',
  });
  return supplier;
};