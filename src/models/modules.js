'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const modules = sequelize.define('modules', {
    name: DataTypes.STRING,
    identity: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    deleted_by: DataTypes.STRING
  }, {
    paranoid : true
  })

  return modules;
};