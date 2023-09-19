'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_item_deliveries', {
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
      customer_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      zip_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      delivery_agent_id: {
        type: Sequelize.UUID
      },
      delivery_status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      delivery_point_address_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      delivery_address: {
        type: Sequelize.JSON
      },
      delivery_date: {
        type: Sequelize.DATE
      },
      delivery_time: {
        type: Sequelize.STRING
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      product_sku: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_image: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      payment_status: {
        type: Sequelize.STRING
      },
      amount_to_be_collected: {
        type: Sequelize.DECIMAL,
        defaultValue: 0.00
      },
      route_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      order_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      delivery_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      variation_type: {
        type: Sequelize.STRING
      },
      variation_value: {
        type: Sequelize.STRING
      },
      remark: {
        type: Sequelize.TEXT
      },
      createdBy: {
        type: Sequelize.UUID
      },
      updatedBy: {
        type: Sequelize.UUID
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_item_deliveries');
  }
};