'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class configuration_rules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      configuration_rules.belongsToMany(models.categories, {
        through: 'category_configuration_rules', foreignKey: 'rule_id', as: 'config_rules_category'
      });
      configuration_rules.belongsToMany(models.products, {
        through: 'product_configuration_rules', foreignKey: 'rule_id', as: 'config_rule_products'
      })
    }
  };
  configuration_rules.init({
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    rule_values: DataTypes.JSON,
    is_active: DataTypes.BOOLEAN,
    is_default: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'configuration_rules',
  });
  return configuration_rules;
};