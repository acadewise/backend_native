'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class attribute_sets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  attribute_sets.init({
    name: DataTypes.STRING,
    identity: DataTypes.STRING,
    order: DataTypes.INTEGER
  }, {
    paranoid : true,
    sequelize,
    modelName: 'attribute_sets',
  });
  return attribute_sets;
};