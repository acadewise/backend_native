'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('order_items', 'milk_delivery_type', {
        type: Sequelize.ARRAY(Sequelize.STRING),
        after: 'delivery_time'
      }),
      queryInterface.addColumn('order_items', 'milk_delivery_slot', {
        type: Sequelize.JSON,
        after: 'milk_delivery_type'
      }),
      queryInterface.addColumn('order_items', 'additional_rule_json', {
        type: Sequelize.JSON,
        after: 'milk_delivery_slot'
      }),
      queryInterface.changeColumn("order_items", "custom_delivery_dates", {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('order_items', 'milk_delivery_type'),
      queryInterface.removeColumn('order_items', 'milk_delivery_slot'),
      queryInterface.removeColumn('order_items', 'additional_rule_json'),
      queryInterface.removeColumn('order_items', 'custom_delivery_dates')
    ]);
  }
};
