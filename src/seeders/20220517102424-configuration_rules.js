'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('configuration_rules', [
      {
        name: 'Routine',
        slug: 'routine',
        rule_values: JSON.stringify(
          [
            {
              name: "Daily",
              key: "daily",
              is_active: true,
              rule_details: [
                {
                  name: "Delivery Start Date",
                  slug: 'daily_delivery_start_date',
                  is_active: true
                },
                {
                  name: "Delivery End Date",
                  slug: 'daily_delivery_end_date',
                  is_active: true
                },
                {
                  name: "Delivery Time",
                  slug: 'daily_delivery_time',
                  is_active: true
                },
                {
                  name: "Quantity",
                  slug: 'daily_quantity',
                  is_active: true
                },
                {
                  name: "Auto Renew",
                  slug: 'daily_auto_renew',
                  is_active: true
                }
              ]
            }, {
              name: "One time",
              key: "one_time",
              is_active: true,
              rule_details: [
                {
                  name: "Quantity",
                  slug: 'one_time_quantity',
                  is_active: true
                }
              ]
            }, {
              name: "Custom",
              key: "custom",
              is_active: true,
              rule_details: [
                {
                  name: "Delivery Start Date",
                  slug: 'custom_delivery_start_date',
                  is_active: true
                },
                {
                  name: "Delivery End Date",
                  slug: 'custom_delivery_end_date',
                  is_active: true
                },
                {
                  name: "Quantity",
                  slug: 'custom_quantity',
                  is_active: true
                },
                {
                  name: "Delivery Time",
                  slug: 'custom_delivery_time',
                  is_active: true
                }
              ]
            }
          ]
        ),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Milk delivery',
        slug: 'milk_delivery',
        rule_values: JSON.stringify(
          [
            {
              name: "Morning",
              key: "morning",
              is_active: true,
              time_slot: [
                {
                  name: "5:00 - 6:00 AM",
                  key: "5_6a",
                  is_active: true
                }, {
                  name: "6:00 - 7:00 AM",
                  key: "6_7a",
                  is_active: true
                }, {
                  name: "7:00 - 8:00 AM",
                  key: "7_8a",
                  is_active: true
                }, {
                  name: "8:00 - 9:00 AM",
                  key: "8_9a",
                  is_active: true
                }, {
                  name: "9:00 - 10:00 AM",
                  key: "9_10a",
                  is_active: true
                }, {
                  name: "10:00 - 11:00 AM",
                  key: "10_11a",
                  is_active: true
                }, {
                  name: "11:00 - 12:00 AM",
                  key: "11_12a",
                  is_active: true
                }
              ]
            }, {
              name: "Afternoon",
              key: "afternoon",
              is_active: true,
              time_slot: [
                {
                  name: "12:00 - 1:00 PM",
                  key: "12_1p",
                  is_active: true
                },
                {
                  name: "1:00 - 2:00 PM",
                  key: "1_2p",
                  is_active: true
                },
                {
                  name: "2:00 - 3:00 PM",
                  key: "2_3p",
                  is_active: true
                },
                {
                  name: "3:00 - 4:00 PM",
                  key: "3_4p",
                  is_active: true
                },
                {
                  name: "4:00 - 5:00 PM",
                  key: "4_5p",
                  is_active: true
                }
              ]
            }, {
              name: "Evening",
              key: "evening",
              is_active: true,
              time_slot: [
                {
                  name: "5:00 - 6:00 PM",
                  key: "5_6p",
                  is_active: true
                },
                {
                  name: "6:00 - 7:00 PM",
                  key: "6_7p",
                  is_active: true
                },
                {
                  name: "7:00 - 8:00 PM",
                  key: "7_8p",
                  is_active: true
                },
                {
                  name: "8:00 - 9:00 PM",
                  key: "8_9p",
                  is_active: true
                },
                {
                  name: "9:00 - 10:00 PM",
                  key: "9_10p",
                  is_active: true
                }
              ]
            }
          ]
        ),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('configuration_rules', null, {});
  }
};
