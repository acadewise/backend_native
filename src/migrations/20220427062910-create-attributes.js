'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('attributes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      image: {
        type: Sequelize.STRING
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_searchable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_comparable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_use_in_product_listing: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('attributes');
  }
};