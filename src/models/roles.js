"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define(
    "roles",
    {
      name: DataTypes.STRING,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      deleted_by: DataTypes.STRING,
    },
    {}
  );

  Roles.associate = function (models) {
    // associations can be defined here
    Roles.hasMany(models.admins, {
      foreignKey: "role",
      onDelete: "CASCADE",
    });
  };

  return Roles;
};
