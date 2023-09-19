'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order_addresses', {
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
      billing_address_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      billing_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      billing_email: {
        type: Sequelize.STRING
      },
      billing_phone_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      billing_street_address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      billing_landmark: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      billing_city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      billing_state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      billing_country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      billing_zip_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shipping_address_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shipping_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shipping_email: {
        type: Sequelize.STRING
      },
      shipping_phone_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shipping_street_address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      shipping_landmark: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      shipping_city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shipping_state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shipping_country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shipping_zip_code: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('order_addresses');
  }
};