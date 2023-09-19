"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const user_addresses = sequelize.define(
    "user_addresses",
    {
      user_id: DataTypes.UUID,
      address_type: DataTypes.ENUM('home', 'office', 'other'),
      is_default: DataTypes.BOOLEAN,
      phone_number: DataTypes.STRING,
      street: DataTypes.TEXT,
      landmark: DataTypes.TEXT,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      zipcode: DataTypes.STRING,
      country: DataTypes.STRING,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      deleted_by: DataTypes.STRING,
    },
    {
      paranoid: true
    }
  );

  user_addresses.associate = function (models) {
    // associations can be defined here
    user_addresses.belongsTo(models.users, {
      foreignKey: "user_id",
      as: "user",
      onDelete: "CASCADE",
    });
  };
  return user_addresses;
};
