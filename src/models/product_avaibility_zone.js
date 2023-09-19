'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_avaibility_zone extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  product_avaibility_zone.init({
    product_id: DataTypes.INTEGER,
    inventary_geoname_id: DataTypes.INTEGER,
    zip_code: DataTypes.STRING,
    is_available: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'product_avaibility_zone',
  });
  return product_avaibility_zone;
};