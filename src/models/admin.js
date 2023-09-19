"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const admin = sequelize.define("admins", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    payment_permission_type: DataTypes.STRING,
    profile_image: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    role: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    deleted_by: DataTypes.STRING,
  });

  admin.associate = function (models) {
    // associations can be defined here
    admin.belongsTo(models.roles, {
      foreignKey: "role",
      as: "roles",
      onDelete: "CASCADE",
    });
    admin.hasOne(models.roles, { foreignKey: 'id', sourceKey: 'role', as: 'role_detail' });
    admin.hasMany(models.delivery_route_agent, { foreignKey: 'agent_id', sourceKey: 'id', as: 'delivery_route' });
  };

  return admin;
};
