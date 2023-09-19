'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      zip_code: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      order_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      customer_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      remote_ip: {
        type: Sequelize.STRING,
        allowNull: false
      },
      order_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      order_delivery_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      order_status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      order_status_description: {
        type: Sequelize.TEXT
      },
      billing_address_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      shipping_address_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tax_amount: {
        type: Sequelize.DECIMAL
      },
      shipping_amount: {
        type: Sequelize.DECIMAL
      },
      coupon_code: {
        type: Sequelize.STRING
      },
      discount_amount: {
        type: Sequelize.DECIMAL
      },
      grand_total: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      payment_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      payment_status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      payment_details: {
        type: Sequelize.JSON
      },
      expected_delivery_date: {
        type: Sequelize.DATE
      },
      shipping_method: {
        type: Sequelize.STRING
      },
      order_item: {
        type: Sequelize.JSON
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false
      },
      updated_by: {
        type: Sequelize.UUID,
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
    await queryInterface.dropTable('orders');
  }
};