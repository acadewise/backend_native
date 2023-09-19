'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('brands', 'name', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('brands', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    })
  }
};
