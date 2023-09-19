'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class attribute_values extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association 
      attribute_values.belongsTo(models.attributes, {foreignKey: 'attribute_id', as: 'value_attribute'});
      attribute_values.belongsToMany(models.attributes, { through: 'product_attribute_values', foreignKey: 'attribute_value_id', as: 'attr_value_prodcuts'});
    }
  };
  attribute_values.init({
    attribute_id: DataTypes.INTEGER,
    label: DataTypes.STRING,
    value: DataTypes.STRING,
    image: DataTypes.STRING,
    is_default: DataTypes.BOOLEAN,
    order: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    deleted_by: DataTypes.STRING
  }, {
    paranoid : true,
    sequelize,
    modelName: 'attribute_values',
  });
  return attribute_values;
};