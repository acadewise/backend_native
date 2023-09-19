'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('inventory_masters', 'remarks', {
        allowNull: true,
        type: Sequelize.TEXT
      }),
      queryInterface.changeColumn('inventory_masters', 'reason', {
        allowNull: true,
        type: Sequelize.TEXT
      }),
      queryInterface.changeColumn('inventory_masters', 'bill_reference_no', {
        allowNull: true,
        type: Sequelize.STRING
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('inventory_masters', 'total_quantity')
    ]);
  }
};
