'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_item_delivery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      order_item_delivery.hasOne(models.orders, { foreignKey: 'order_id', sourceKey: 'order_id', as: 'order_details' });
      order_item_delivery.hasOne(models.users, { foreignKey: 'id', sourceKey: 'customer_id', as: 'customer_details' });
      order_item_delivery.hasOne(models.delivery_point_address, { foreignKey: 'id', sourceKey: 'delivery_point_address_id', as: 'pickup_address_details' });
      order_item_delivery.hasOne(models.admins, { foreignKey: 'id', sourceKey: 'delivery_agent_id', as: 'delivery_agent_details' });
      order_item_delivery.hasOne(models.categories, { foreignKey: 'id', sourceKey: 'category_id', as: 'category_details' });
      order_item_delivery.hasOne(models.products, { foreignKey: 'id', sourceKey: 'product_id', as: 'product_detail'});
      order_item_delivery.hasMany(models.product_image_videos, { foreignKey: 'product_id', sourceKey: 'product_id',as: 'product_images' });
      order_item_delivery.hasOne(models.product_image_videos, { foreignKey: 'product_id', sourceKey: 'product_id',as: 'ordered_product_image' });
      
    }
  }
  order_item_delivery.init({
    order_id: DataTypes.STRING,
    customer_id: DataTypes.UUID,
    zip_code: DataTypes.STRING,
    delivery_agent_id: DataTypes.UUID,
    delivery_status: DataTypes.STRING,
    delivery_point_address_id: DataTypes.INTEGER,
    delivery_address: DataTypes.JSON,
    delivery_date: DataTypes.DATE,
    delivery_time: DataTypes.STRING,
    product_id: DataTypes.INTEGER,
    product_sku: DataTypes.STRING,
    product_name: DataTypes.STRING,
    product_image: DataTypes.STRING,
    quantity: DataTypes.DECIMAL,
    payment_status: DataTypes.STRING,
    amount_to_be_collected: DataTypes.DECIMAL,
    route_id: DataTypes.INTEGER,
    order_type: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    delivery_type: DataTypes.STRING,
    variation_type: DataTypes.STRING,
    variation_value: DataTypes.STRING,
    remark: DataTypes.TEXT,
    createdBy: DataTypes.UUID,
    updatedBy: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'order_item_delivery',
  });
  return order_item_delivery;
};