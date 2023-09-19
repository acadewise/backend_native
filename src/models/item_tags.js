'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class item_tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  item_tags.init({
    item_id: DataTypes.INTEGER,
    item_type: DataTypes.SMALLINT,
    tag_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'item_tags',
    createdAt: false,
    updatedAt: false
  });
  return item_tags;
};