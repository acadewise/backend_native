"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const images = sequelize.define("images", {
    media_type: DataTypes.STRING,
    type: DataTypes.STRING,
    url: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  });

  return images;
};
