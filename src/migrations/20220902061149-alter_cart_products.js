"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("cart_products", "expected_delivery_date", {
        type: Sequelize.DATE,
        allowNull: true,
        after: "product_coupon_code",
      }),
      queryInterface.addColumn("cart_products", "expected_delivery_time", {
        type: Sequelize.STRING,
        allowNull: true,
        after: "expected_delivery_date",
      }),
      queryInterface.changeColumn("cart_products", "delivery_time_slot", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn("cart_products", "custom_delivery_dates", {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn("cart_products", "expected_delivery_date"),
      queryInterface.removeColumn("cart_products", "expected_delivery_time"),
      queryInterface.removeColumn("cart_products", "delivery_time_slot"),
      queryInterface.removeColumn("cart_products", "custom_delivery_dates"),
    ]);
  },
};
