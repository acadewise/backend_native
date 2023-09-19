"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_home_accesses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_home_id: {
        type: Sequelize.INTEGER,
      },
      access_by: {
        type: Sequelize.INTEGER,
      },
      invited_by: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("user_home_accesses");
  },
};
