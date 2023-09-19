'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      product_category.hasOne(models.categories, { foreignKey: 'id', sourceKey: 'category_id', as: 'category_details' });
      product_category.hasMany(models.products, { foreignKey: 'id', sourceKey: 'product_id', as: 'category_product'});
    }
  };
  product_category.init({
    category_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    sequelize,
    modelName: 'product_category',
    createdAt: false,
    updatedAt: false
  });
  return product_category;
};