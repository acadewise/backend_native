'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('delivery_point_addresses', 'delivery_point_name', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'id'
    }),
    queryInterface.addColumn('delivery_point_addresses', 'delivery_point_details', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'id'
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
