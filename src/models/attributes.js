'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class attributes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      attributes.hasMany(models.attribute_values, { foreignKey: 'attribute_id', as: 'attribute_values'});
      attributes.belongsToMany(models.products, { through: 'product_attributes', foreignKey: 'attribute_id', as:"prod_attributes"});
      attributes.belongsToMany(models.categories, { through: 'attribute_categories', foreignKey: 'attribute_id', as: 'attrib_categories'});
      attributes.belongsToMany(models.attribute_values, { through: 'product_attribute_values', foreignKey: 'attribute_id', as: 'prod_attr_values'})
    }
  };
  attributes.init({
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    image: DataTypes.STRING,
    order: DataTypes.INTEGER,
    is_default: DataTypes.BOOLEAN,
    is_searchable: DataTypes.BOOLEAN,
    is_comparable: DataTypes.BOOLEAN,
    is_use_in_product_listing: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    deleted_by: DataTypes.STRING
  }, {
    paranoid : true,
    sequelize,
    modelName: 'attributes',
  });
  return attributes;
};