'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupon_masters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      coupon_code: {
        type: Sequelize.STRING
      },
      coupon_title: {
        type: Sequelize.STRING
      },
      coupon_description: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      coupon_type: {
        type: Sequelize.ENUM('Percent', 'Fixed'),
        defaultValue: 'Fixed'
      },
      coupon_quantity: {
        type: Sequelize.INTEGER
      },
      used_coupon_quantity: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      coupon_amount: {
        type: Sequelize.DECIMAL
      },
      min_order_amount: {
        allowNull: true,
        type: Sequelize.DECIMAL
      },
      user_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      coupen_uses_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      from_date: {
        type: Sequelize.DATE
      },
      to_date: {
        type: Sequelize.DATE
      },
      coupon_status: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('coupon_masters');
  }
};