'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('order_items', 'customer_id', {
        type: Sequelize.UUID,
        allowNull: true,
        after: 'order_id'
      }),
      queryInterface.addColumn('order_items', 'image', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'description'
      }),
      queryInterface.addColumn('order_items', 'expected_delivery_date', {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'product_delivery_type'
      }),
      queryInterface.addColumn('order_items', 'expected_delivery_time', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'expected_delivery_date'
      }),
      queryInterface.changeColumn('order_items', 'delivery_time', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('order_items', 'is_added_to_delivery', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        after: 'additional_rule_json'
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('order_items', 'customer_id'),
      queryInterface.removeColumn('order_items', 'expected_delivery_date'),
      queryInterface.removeColumn('order_items', 'expected_delivery_time'),
      queryInterface.changeColumn('order_items', 'delivery_time', {
        type: Sequelize.DATE,
        allowNull: true
      }),
      queryInterface.removeColumn('order_items', 'is_added_to_delivery')
    ]);
  }
};
