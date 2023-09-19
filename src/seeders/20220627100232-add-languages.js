'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      "languages",
      [
        {
          name: "English",
          slug: "english",
          code: "en",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Hindi",
          slug: "hindi",
          code: "hi",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {}
    ),
  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete("languages", null, {}),
};

