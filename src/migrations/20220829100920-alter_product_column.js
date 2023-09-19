'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('products', 'delivery_route_ids', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'description'
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('products', 'delivery_route_ids')
  }
};
