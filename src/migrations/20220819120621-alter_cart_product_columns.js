'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('cart_products', 'product_delivery_type', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'one-time',
      after: 'cart_uuid'
    }),
      queryInterface.addColumn('cart_products', 'product_variation_type', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'quantity'
      }),
      queryInterface.addColumn('cart_products', 'product_variation_value', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'product_variation_type'
      }),
      queryInterface.addColumn('cart_products', 'product_coupon_code', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'product_variation_value'
      }),
      queryInterface.addColumn('cart_products', 'delivery_start_date', {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'product_coupon_code'
      }),
      queryInterface.addColumn('cart_products', 'delivery_end_date', {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'delivery_start_date'
      }),
      queryInterface.addColumn('cart_products', 'delivery_time_slot', {
        type: Sequelize.TIME,
        allowNull: true,
        after: 'delivery_end_date'
      }),
      queryInterface.addColumn('cart_products', 'auto_renew_subscription', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        after: 'delivery_time_slot'
      }),
      queryInterface.addColumn('cart_products', 'milk_delivery_type', {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        after: 'auto_renew_subscription'
      }),
      queryInterface.addColumn('cart_products', 'milk_delivery_slot', {
        type: Sequelize.JSON,
        allowNull: true,
        after: 'milk_delivery_type'
      }),
      queryInterface.addColumn('cart_products', 'additional_rule_json', {
        type: Sequelize.JSON,
        allowNull: true,
        after: 'milk_delivery_slot'
      })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('cart_products', 'product_delivery_type'),
      queryInterface.removeColumn('cart_products', 'product_variation_type'),
      queryInterface.removeColumn('cart_products', 'product_variation_value'),
      queryInterface.removeColumn('cart_products', 'product_coupon_code'),
      queryInterface.removeColumn('cart_products', 'delivery_start_date'),
      queryInterface.removeColumn('cart_products', 'delivery_end_date'),
      queryInterface.removeColumn('cart_products', 'delivery_time_slot'),
      queryInterface.removeColumn('cart_products', 'auto_renew_subscription'),
      queryInterface.removeColumn('cart_products', 'milk_delivery_type'),
      queryInterface.removeColumn('cart_products', 'milk_delivery_slot'),
      queryInterface.removeColumn('cart_products', 'additional_rule_json')
  }
};
