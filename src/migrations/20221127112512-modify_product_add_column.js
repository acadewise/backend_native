'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('products', 'show_on_web', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true,
      after: 'description'
    })
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('products', 'show_on_web')
  }
};
