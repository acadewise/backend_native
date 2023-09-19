'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_delivery_agents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      delivery_agent_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      delivery_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      delivery_point_address_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      delivery_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      delivery_time: {
        type: Sequelize.STRING,
        allowNull: true
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_delivery_agents');
  }
};