'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      address_type: {
        type: Sequelize.ENUM('home', 'office', 'other'),
        defaultValue: 'home'
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      phone_number: {
        type: Sequelize.STRING
      },
      street: {
        type: Sequelize.TEXT
      },
      landmark: {
        type: Sequelize.TEXT
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      zipcode: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
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
        type: Sequelize.DATE
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_addresses');
  }
};