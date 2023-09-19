"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("activity_logs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      admin_type: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      module_type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      activity: {
        type: Sequelize.TEXT,
      },
      created_by: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("activity_logs");
  },
};
