"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.renameColumn("products", "route_ids", "delivery_route_ids");
  },

  async down(queryInterface, Sequelize) {
    queryInterface.renameColumn("products", "delivery_route_ids", "route_ids");
  },
};
