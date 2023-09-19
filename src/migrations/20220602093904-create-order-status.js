'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order_status_history', {
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
      action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      action_description: {
        type: Sequelize.TEXT
      },
      extra: {
        type: Sequelize.TEXT
      },
      is_customer_notified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false
      },
      updated_by: {
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('order_status_history');
  }
};