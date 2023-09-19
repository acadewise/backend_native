'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    queryInterface.addColumn('admins', 'phone_number', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'password'
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
