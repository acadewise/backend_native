'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_attribute_values extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      product_attribute_values.belongsTo(models.product_attributes, { foreignKey: 'attribute_id', sourceKey: 'attribute_id', as: 'prod_val_attributes'});
    }
  };
  product_attribute_values.init({
    product_id: DataTypes.INTEGER,
    attribute_id: DataTypes.INTEGER,
    attribute_value_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'product_attribute_values',
    createdAt: false,
    updatedAt: false
  });
  return product_attribute_values;
};