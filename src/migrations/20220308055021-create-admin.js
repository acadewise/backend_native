"use strict";

const { BOOLEAN, Sequelize } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface.createTable("admins", {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal("uuid_generate_v4()"),
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING,
          },
          email: {
            type: Sequelize.STRING,
            unique: true,
          },
          password: {
            type: Sequelize.STRING,
          },
          payment_permission_type: {
            type: Sequelize.STRING,
          },
          profile_image: {
            type: Sequelize.STRING,
          },
          role: {
            type: Sequelize.INTEGER,
          },
          is_active: {
            type: BOOLEAN,
            defaultValue: true,
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
          }
        });
      });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("admins");
  },
};
