'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('coupon_masters', 'min_order_amount', {
      type: Sequelize.DECIMAL,
      allowNull: true,
      after: 'coupon_amount'
    }),
    queryInterface.addColumn('coupon_masters', 'user_type', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'coupon_amount'
    }),
    queryInterface.addColumn('coupon_masters', 'coupen_uses_type', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'coupon_amount'
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
