'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      length: 30,
      unique: true
    });
    queryInterface.changeColumn('users', 'phone_number', {
      type: Sequelize.STRING,
      length: 20,
      allowNull: false,
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      unique: true
    });
    queryInterface.changeColumn('users', 'phone_number', {
      type: Sequelize.STRING,
      unique: true
    });
  }
};
