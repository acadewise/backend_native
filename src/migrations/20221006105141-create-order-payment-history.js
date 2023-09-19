'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_payment_histories', {
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
      amount_type: {                       //CREDIT/DEBIT ( DR/CR)
        type: Sequelize.STRING,
        allowNull: false
      },
      payment_note: {                 ///  Advance/Due/Adjustment
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL,
        defaultValue: 0.00
      },
      payment_remark: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_mode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      transaction_remark: {
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
    await queryInterface.dropTable('order_payment_histories');
  }
};