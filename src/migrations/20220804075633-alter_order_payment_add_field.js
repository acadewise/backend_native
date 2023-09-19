'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('order_payments', 'advance_payment', {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
        after: 'payment_amount'
      }),
      queryInterface.addColumn('order_payments', 'remaining_payment', {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
        allowNull: false,
        after: 'advance_payment'
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('order_payments', 'advance_payment'),
      queryInterface.removeColumn('order_payments', 'remaining_payment')
    ]);
  }
};
