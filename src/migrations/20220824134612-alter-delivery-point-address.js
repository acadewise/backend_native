'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('delivery_point_addresses', 'pincode', {
      type: 'INTEGER USING CAST("pincode" as INTEGER)',
      defaultValue:0
    });
  },

  async down (queryInterface, Sequelize) {
    //await queryInterface.dropTable('delivery_point_addresses');
  }
};
