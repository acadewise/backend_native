"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class configuration_variables extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  configuration_variables.init(
    {
      name: DataTypes.STRING,
      value: DataTypes.STRING,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      deleted_by: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "configuration_variables",
    }
  );
  return configuration_variables;
};
