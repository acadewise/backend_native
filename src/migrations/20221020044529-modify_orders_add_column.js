'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('orders', 'adjustment_amount', {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
      allowNull: false,
      after: 'advance_payment'
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
