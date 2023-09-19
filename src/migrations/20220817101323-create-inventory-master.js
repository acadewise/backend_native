'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory_masters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      supplier_id: {
        type: Sequelize.INTEGER
      },
      stock_quantity: {
        type: Sequelize.INTEGER
      },
      customer_total_order_prediction: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      inventory_type: {
        type: Sequelize.STRING,
        // type: Sequelize.ENUM('IN', 'OUT','PREDICTION'),
        defaultValue: 'IN'
      },
      bill_reference_no: {
        type: Sequelize.STRING
      },
      remarks: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      reason: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      effective_date: {
        type: Sequelize.DATE
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inventory_masters');
  }
};