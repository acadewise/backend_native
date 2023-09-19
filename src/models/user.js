"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      dob: DataTypes.STRING,
      gender: DataTypes.STRING,
      profile_picture: DataTypes.STRING,
      invitedBy: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
      google_id: DataTypes.STRING,
      facebook_id: DataTypes.STRING,
      phone_verification_token: DataTypes.STRING,
      email_verification_token: DataTypes.STRING,
      is_email_verified: DataTypes.BOOLEAN,
      is_phone_verified: DataTypes.BOOLEAN,
      login_pin: DataTypes.STRING,
      is_login_pin_active: DataTypes.BOOLEAN,
      fingerprint: DataTypes.STRING,
      is_fingerprint_active: DataTypes.BOOLEAN,
      last_login: DataTypes.DATE,
      fcmToken: DataTypes.ARRAY(DataTypes.STRING),
      system_properties: DataTypes.JSON,
      language_id: DataTypes.INTEGER
    },
    {}
  );

  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.user_addresses, {
      foreignKey: "user_id",
      as: "user_addresses",
      onDelete: "CASCADE",
    });
    User.hasOne(models.language, {
      foreignKey: "id",
      sourceKey: "language_id",
      as: "user_language",
      onDelete: "CASCADE",
    });
    User.hasMany(models.orders, {foreignKey: "customer_id", as: "customer_orders"});
  };
  return User;
};
