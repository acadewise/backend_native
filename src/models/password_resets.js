'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const password_resets = sequelize.define('password_resets', {
    admin_id: DataTypes.INTEGER,
    token: DataTypes.STRING,
    expire_at: DataTypes.DATE
  })

  return password_resets;
};
