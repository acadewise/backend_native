'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn("categories", "show_on_web", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true,
      after: "is_featured",
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn("categories", "show_on_web");
  }
};
