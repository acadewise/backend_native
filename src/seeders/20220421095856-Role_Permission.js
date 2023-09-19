"use strict";
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
     const modules = [
      {
        name: "Admin Management",
        identity: "adm_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "User Management",
        identity: "usr_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Permission Management",
        identity: "per_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Store Settings",
        identity: "str_stg",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Category Management",
        identity: "ctg_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Product Management",
        identity: "prod_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Product Tags Management",
        identity: "prod_tag_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Product Reviews Management",
        identity: "prod_rev_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Brands Management",
        identity: "brd_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Attributes Management",
        identity: "atb_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Product Collection Management",
        identity: "prod_col_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Order Management",
        identity: "odr_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Shipping Management",
        identity: "ship_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Discount Management",
        identity: "dist_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Payment Management",
        identity: "pay_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Taxes Management",
        identity: "tax_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "SEO Management",
        identity: "seo_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Blogs Management",
        identity: "blg_mgt",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Additional Services",
        identity: "adt_ser",
        is_active: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];    
    const data = modules.map((module, index) => {
      return { 
        role_id: 1,
        module_id: index + 1,
        can_view: true,
        can_edit: true,
        created_by: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    await queryInterface.bulkInsert("role_permissions", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("role_permissions", null, {});
  },
};
