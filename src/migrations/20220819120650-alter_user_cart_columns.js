'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('user_carts', 'cart_type', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'ONE_TIME_ORDERS',
      after: 'cart_status'
    }),
      queryInterface.addColumn('user_carts', 'virtual_order_id', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'cart_type'
      }),
      queryInterface.addColumn('user_carts', 'shipping_pin_code', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'virtual_order_id'
      }),
      queryInterface.addColumn('user_carts', 'shipping_address_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'shipping_pin_code'
      }),
      queryInterface.addColumn('user_carts', 'billing_address_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'shipping_address_id'
      }),
      queryInterface.addColumn('user_carts', 'currency', {
        type: Sequelize.STRING,
        defaultValue: "INR",
        after: 'billing_address_id'
      }),
      queryInterface.addColumn('user_carts', 'coupon_code', {
        type: Sequelize.STRING,
        allowNull: true,
        after: 'currency'
      }),
      queryInterface.addColumn('user_carts', 'include_reward_coin_pay', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        after: 'coupon_code'
      }),
      queryInterface.addColumn('user_carts', 'pay_reward_coin_quantity', {
        type: Sequelize.DECIMAL,
        defaultValue: 0.00,
        after: 'include_reward_coin_pay'
      })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('user_carts', 'cart_type'),
      queryInterface.removeColumn('user_carts', 'virtual_order_id'),
      queryInterface.removeColumn('user_carts', 'shipping_pin_code'),
      queryInterface.removeColumn('user_carts', 'shipping_address_id'),
      queryInterface.removeColumn('user_carts', 'billing_address_id'),
      queryInterface.removeColumn('user_carts', 'currency'),
      queryInterface.removeColumn('user_carts', 'coupon_code'),
      queryInterface.removeColumn('user_carts', 'include_reward_coin_pay'),
      queryInterface.removeColumn('user_carts', 'pay_reward_coin_quantity')
  }
};
