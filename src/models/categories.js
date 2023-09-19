"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const categories = sequelize.define(
    "categories",
    {
      parent_id: DataTypes.INTEGER,
      group_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.STRING,
      position: DataTypes.INTEGER,
      image: DataTypes.INTEGER,
      is_featured: DataTypes.BOOLEAN,
      show_on_web: DataTypes.BOOLEAN,
      category_color_code: DataTypes.STRING,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      deleted_by: DataTypes.STRING,
    },
    {
      paranoid: true,
    }
  );

  categories.associate = function (models) {
    // associations can be defined here.
    categories.belongsToMany(models.products, {
      through: 'product_category', foreignKey: 'category_id', as: 'cat_products'
    });
    categories.belongsToMany(models.attributes, {
      through: 'attribute_categories', foreignKey: 'category_id', as: 'cat_attributes'
    });
    categories.belongsToMany(models.configuration_rules, {
      through: 'category_configuration_rules', foreignKey: 'category_id', as: 'cat_config_rules'
    });
    categories.hasMany(categories, { as: 'sub_category', foreignKey: 'parent_id' })
  };

  return categories;
};
