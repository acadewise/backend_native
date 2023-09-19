'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      parent_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      ordered_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      product_type: {
        type: Sequelize.SMALLINT,
        allowNull: false
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
      },
      quantity: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 1
      },
      restock_quantity: {
        type: Sequelize.DECIMAL
      },
      variation_type: {
        type: Sequelize.STRING
      },
      variation_value: {
        type: Sequelize.STRING
      },
      product_delivery_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'one-time'
      },
      expected_delivery_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      delivery_start_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      delivery_end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      auto_renew_subscription: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      delivery_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      no_discount: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      base_cost: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      base_price: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      discount_amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0.0,
      },
      discounted_price: {
        type: Sequelize.DECIMAL
      },
      tax_amount: {
        type: Sequelize.DECIMAL
      },
      product_detail_json: {
        type: Sequelize.JSON,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('order_items');
  }
};