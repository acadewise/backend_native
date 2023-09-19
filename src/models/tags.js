'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const tags = sequelize.define('tags', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    deleted_by: DataTypes.STRING
  }, {
    paranoid : true
  });

  tags.associate = function (models) {
    tags.belongsToMany(models.products, { through: 'item_tags', foreignKey: 'tag_id'});
  };
  return tags;
};