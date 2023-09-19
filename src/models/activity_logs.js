"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const activity_logs = sequelize.define(
    "activity_logs",
    {
      admin_type: DataTypes.STRING,
      module_type: DataTypes.STRING,
      activity: DataTypes.TEXT,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      deleted_by: DataTypes.STRING,
    },
    {
      paranoid: true,
    }
  );

  return activity_logs;
};
