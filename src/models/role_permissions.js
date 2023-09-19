"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const role_permissions = sequelize.define(
    "role_permissions",
    {
      admin_id: DataTypes.STRING,
      module_id: DataTypes.INTEGER,
      can_view: DataTypes.BOOLEAN,
      can_edit: DataTypes.BOOLEAN,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      deleted_by: DataTypes.STRING,
    },
    {
      paranoid: true,
    }
  );

  return role_permissions;
};
