'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('inventory_geonames', 'zip_description', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'province'
    })
  },

  async down (queryInterface, Sequelize) {
   
  }
};
