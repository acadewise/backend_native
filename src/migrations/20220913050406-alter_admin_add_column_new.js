'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('admins', 'payment_permission_type', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'password'
    })
  },

  async down (queryInterface, Sequelize) {
    
  }
};
