'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.changeColumn('order_delivery_agents', 'delivery_status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
   
  }
};
