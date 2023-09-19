'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('order_addresses', 'is_active', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn('order_addresses', 'is_active')]);
  }
};
