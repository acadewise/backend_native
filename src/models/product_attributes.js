'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_attributes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      product_attributes.hasMany(models.product_attribute_values, { foreignKey: 'attribute_id', sourceKey: 'attribute_id', as: 'prod_attr_values' });
    }
  };
  product_attributes.init({
    product_id: DataTypes.INTEGER,
    attribute_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'product_attributes',
    createdAt: false,
    updatedAt: false
  });
  return product_attributes;
};