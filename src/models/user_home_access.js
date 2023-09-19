"use strict";
const { Model } = require("sequelize");
// module.exports = (sequelize, DataTypes) => {
//   User_Home_Access.init({
//     user_home_id: DataTypes.INTEGER,
//     access_by: DataTypes.INTEGER,
//     invited_by: DataTypes.INTEGER,
//     created_by: DataTypes.INTEGER,
//   }, {
//     sequelize,
//     modelName: 'User_Home_Access',
//   });
//   return User_Home_Access;
// };

module.exports = (sequelize, DataTypes) => {
  const User_Home_Access = sequelize.define(
    "user_home_accesses",
    {
      user_home_id: DataTypes.INTEGER,
      access_by: DataTypes.STRING,
      invited_by: DataTypes.STRING,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      deleted_by: DataTypes.STRING,
    },
    {}
  );

  // User_Home_Access.associate = function(models) {
  //   // associations can be defined here
  //   User_Home_Access.hasMany(models.User, {
  //     foreignKey: 'userId',
  //     as: 'user_home_access',
  //     onDelete: 'CASCADE',
  //   })
  // };

  return User_Home_Access;
};
