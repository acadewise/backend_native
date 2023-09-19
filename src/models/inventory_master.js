'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class inventory_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      inventory_master.hasOne(models.products, { foreignKey: 'id', sourceKey: 'product_id', as: 'Inventory_Product_Details' });
      inventory_master.hasOne(models.supplier, { foreignKey: 'id', sourceKey: 'supplier_id', as: 'supplier_details' });
    }
  }
  inventory_master.init({
    product_id: DataTypes.INTEGER,
    supplier_id: DataTypes.INTEGER,
    stock_quantity: DataTypes.INTEGER,
    inventory_type: DataTypes.STRING,
    bill_reference_no: DataTypes.STRING,
    remarks: DataTypes.TEXT,
    reason: DataTypes.TEXT,
    effective_date: DataTypes.DATE,

  }, {
    paranoid: true,
    sequelize,
    modelName: 'inventory_master',
  });
  return inventory_master;
};