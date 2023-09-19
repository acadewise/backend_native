"use strict";

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      "roles",
      [
        {
          name: "super admin",
          created_by: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "admin",
          created_by: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "manager",
          created_by: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "distributor",
          created_by: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "delivery_boy",
          created_by: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    ),
  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete("roles", null, {}),
};
