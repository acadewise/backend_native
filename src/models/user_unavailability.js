'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_unavailability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_unavailability.init({
    customer_id: DataTypes.UUID,
    unavailable_date:DataTypes.STRING,
    address_id:DataTypes.INTEGER,
  }, {
    paranoid: true,
    sequelize,
    modelName: 'user_unavailability',
  });
  return user_unavailability;
};