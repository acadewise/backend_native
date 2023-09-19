"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("role_permissions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      role_id: {
        type: Sequelize.STRING,
      },
      module_id: {
        type: Sequelize.INTEGER,
      },
      can_view: {
        type: Sequelize.BOOLEAN,
      },
      can_edit: {
        type: Sequelize.BOOLEAN,
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
        type: Sequelize.DATE,
      },
      deleteddAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("role_permissions");
  },
};
