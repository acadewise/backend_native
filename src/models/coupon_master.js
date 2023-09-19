'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coupon_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  coupon_master.init({
    coupon_code: DataTypes.STRING,
    coupon_title: DataTypes.STRING,
    coupon_description: DataTypes.TEXT,
    coupon_type: DataTypes.STRING,
    coupon_quantity: DataTypes.INTEGER,
    used_coupon_quantity: DataTypes.INTEGER,
    coupon_amount: DataTypes.FLOAT,
    min_order_amount: DataTypes.FLOAT,
    user_type: DataTypes.STRING,
    coupen_uses_type: DataTypes.STRING,
    from_date: DataTypes.DATE,
    to_date: DataTypes.DATE,
    coupon_status: DataTypes.BOOLEAN,
  }, {
    paranoid: true,
    sequelize,
    modelName: 'coupon_master',
  });
  return coupon_master;
};