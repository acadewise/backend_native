'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('delivery_point_addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      street_address: {
        type: Sequelize.TEXT
      },
      land_mark: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      city: {
        allowNull: true,
        type: Sequelize.STRING
      },
      state: {
        allowNull: true,
        type: Sequelize.STRING
      },
      pincode: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      delivery_type: {
        allowNull: true,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('delivery_point_addresses');
  }
};