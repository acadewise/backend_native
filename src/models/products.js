'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    name: DataTypes.STRING,
    sku: DataTypes.STRING,
    description: DataTypes.TEXT,
    delivery_route_ids: DataTypes.STRING,
    product_type: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
    stock_status: DataTypes.STRING,
    stock_quantity: DataTypes.DECIMAL,
    barcode: DataTypes.STRING,
    product_measurement_unit: DataTypes.INTEGER,
    max_retail_price: DataTypes.DECIMAL,
    product_cost_price: DataTypes.DECIMAL,
    special_sale_price: DataTypes.DECIMAL,
    is_on_sale: DataTypes.BOOLEAN,
    min_buy_quantity: DataTypes.DECIMAL,
    max_buy_quantity: DataTypes.DECIMAL,
    available_time_starts: DataTypes.DATE,
    available_time_ends: DataTypes.DATE,
    brand_id: DataTypes.INTEGER,
    is_variations: DataTypes.BOOLEAN,
    is_searchable: DataTypes.BOOLEAN,
    is_show_on_list: DataTypes.BOOLEAN,
    is_featured: DataTypes.BOOLEAN,
    show_on_web: DataTypes.BOOLEAN,
    add_ons: DataTypes.INTEGER,
    tax: DataTypes.DECIMAL,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    deleted_by: DataTypes.STRING
  }, {
    paranoid: true
  })

  products.associate = function (models) {
    // associations can be defined here
    products.belongsToMany(models.categories, { through: 'product_category', foreignKey: 'product_id', as: 'prod_categories' });
    products.belongsToMany(models.tags, { through: 'item_tags', foreignKey: 'item_id', as: 'prod_tags' });
    products.belongsToMany(models.configuration_rules, {
      through: 'product_configuration_rules', foreignKey: 'product_id', as: 'prod_conf_rules'
    })
    products.belongsToMany(models.attributes, { through: 'product_attributes', foreignKey: 'product_id', as: 'prod_attributes' });
    products.belongsToMany(models.attribute_values, {
      through: 'product_attribute_values', foreignKey: 'product_id', otherKey: 'attribute_value_id', as: 'prod_attr_values'
    });
    products.hasMany(models.product_image_videos, { foreignKey: 'product_id', as: 'product_images' });
    products.hasOne(models.units, { foreignKey: 'id', sourceKey: 'product_measurement_unit', as: 'prod_measurement_unit' });
    products.hasMany(models.inventory_master, { foreignKey: 'product_id', as: 'inventory_details' });
    products.hasOne(models.user_product_wishlist, { foreignKey: 'product_id', as: 'user_wishlist' });
  };
  return products;
};