'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('order_payment_histories', 'payment_mode', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'password'
    }),
    queryInterface.addColumn('order_payment_histories', 'transaction_remark', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'payment_mode'
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
