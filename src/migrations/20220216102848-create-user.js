'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => {
      return queryInterface.createTable('users', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
        },
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        phone_number: {
            type: Sequelize.STRING
        },
        dob: {
            type: Sequelize.STRING
        },
        gender: {
            type: Sequelize.STRING
        },
        profile_picture: {
            type: Sequelize.STRING
        },
        invitedBy: {
            type: Sequelize.INTEGER
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue : true
        },
        google_id: {
            type: Sequelize.STRING
        },
        facebook_id: {
            type: Sequelize.STRING
        },
        phone_verification_token: {
            type: Sequelize.STRING
        },
        email_verification_token: {
            type: Sequelize.STRING
        },
        is_email_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        is_phone_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        last_login: {
            type: Sequelize.DATE
        },
        fcmToken: {
            type: Sequelize.ARRAY(Sequelize.STRING)
        },
        system_properties: {
            type: Sequelize.JSON
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        login_pin: {
          type: Sequelize.STRING
        },
        is_login_pin_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        fingerprint: {
          type: Sequelize.STRING
        },
        is_fingerprint_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        deletedAt: {
            type: Sequelize.DATE
        },
      });
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};