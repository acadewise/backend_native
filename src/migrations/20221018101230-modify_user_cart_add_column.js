'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('user_carts', 'created_by', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'cart_status'
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
