"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class units extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  units.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      deleted_by: DataTypes.STRING,
    },
    {
      paranoid : true,
      sequelize,
      modelName: "units",
    }
  );
  return units;
};
