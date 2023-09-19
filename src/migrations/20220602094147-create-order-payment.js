'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order_payments', {
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
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      payment_amount: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      payment_status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      refund_amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0.0,
      },
      refund_note: {
        type: Sequelize.TEXT
      },
      payment_description: {
        type: Sequelize.TEXT
      },
      payment_detail_json: {
        type: Sequelize.JSON
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
    await queryInterface.dropTable('order_payments');
  }
};