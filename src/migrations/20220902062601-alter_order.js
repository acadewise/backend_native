'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('orders', 'sub_total', {
        type: Sequelize.DECIMAL,
        allowNull: true,
        after: 'discount_amount'
      }),
      queryInterface.addColumn('orders', 'item_total', {
        type: Sequelize.DECIMAL,
        allowNull: true,
        after: 'sub_total'
      })
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('orders', 'sub_total'),
      queryInterface.removeColumn('orders', 'item_total')
    ]);
  }
};
