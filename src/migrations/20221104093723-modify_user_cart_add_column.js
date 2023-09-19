'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('user_carts', 'is_weekly_planner', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true,
      after: 'pay_reward_coin_quantity'
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
