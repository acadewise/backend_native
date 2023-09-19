'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('orders', 'advance_payment', {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
        after: 'discount_amount'
      }),
      queryInterface.addColumn('orders', 'remaining_payment', {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
        after: 'advance_payment'
      }),
      queryInterface.addColumn('orders', 'shipping_discount_amount', {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
        after: 'shipping_amount'
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('orders', 'advance_payment'),
      queryInterface.removeColumn('orders', 'shipping_discount_amount')
    ]);
  }
};
