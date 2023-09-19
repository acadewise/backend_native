'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('orders', 'is_weekly_planner', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true,
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
