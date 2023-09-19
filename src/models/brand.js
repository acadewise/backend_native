"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const brands = sequelize.define(
    "brands",
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      website: DataTypes.STRING,
      logo: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      is_featured: DataTypes.BOOLEAN,
      position: DataTypes.INTEGER,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      deleted_by: DataTypes.STRING,
    },
    {
      paranoid: true,
    }
  );

  return brands;
};
