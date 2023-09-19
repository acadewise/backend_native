'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class attribute_set_attributes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  attribute_set_attributes.init({
    attribute_set_id: DataTypes.INTEGER,
    attribute_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'attribute_set_attributes',
  });
  return attribute_set_attributes;
};