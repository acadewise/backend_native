"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      delivery_route_ids: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      product_type: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      stock_status: {
        type: Sequelize.STRING,
        defaultValue: "active",
      },
      stock_quantity: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      barcode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      product_measurement_unit: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      max_retail_price: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      product_cost_price: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      special_sale_price: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      is_on_sale: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      min_buy_quantity: {
        type: Sequelize.DECIMAL,
        defaultValue: 1,
      },
      max_buy_quantity: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      available_time_starts: {
        type: Sequelize.DATE,
        allowNull: true
      },
      available_time_ends: {
        type: Sequelize.DATE,
        allowNull: true
      },
      brand_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      is_variations: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_searchable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_show_on_list: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      add_ons: {
        type: Sequelize.INTEGER,
      },
      tax: {
        type: Sequelize.DECIMAL,
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: false
      },
      updated_by: {
        type: Sequelize.STRING
      },
      deleted_by: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("products");
  },
};
