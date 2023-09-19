'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_product_wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user_product_wishlist.hasOne(models.products, { foreignKey: 'id', sourceKey: 'product_id', as: 'wishlist_product' });
    }
  }
  user_product_wishlist.init({
    user_id: DataTypes.UUID,
    product_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'user_product_wishlist',
  });
  return user_product_wishlist;
};