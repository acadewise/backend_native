"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     */
    await queryInterface.bulkInsert(
      "admins",
      [
        {
          name: "admin",
          role: 1,
          email: "admin@admin.com",
          password:
            "$2a$12$abALp0BzcWCWOxiA27XQ8e8anTNrhXPJm90g.oRnf5x1wGDVdUWSi", // admin#1234
          created_by: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("admins", null, {});
  },
};
