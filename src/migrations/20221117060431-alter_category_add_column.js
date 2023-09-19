"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("categories", "category_color_code", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "is_featured",
    });
  },
  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn("categories", "category_color_code");
  },
};
