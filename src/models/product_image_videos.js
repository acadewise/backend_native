'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class product_image_videos extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    product_image_videos.init({
        product_id: DataTypes.INTEGER,
        type: DataTypes.STRING,
        url: DataTypes.STRING,
        position: DataTypes.INTEGER,
        is_active: DataTypes.BOOLEAN
    }, {
        modelName: 'product_image_videos',
        sequelize,
        createdAt: false,
        updatedAt: false
    });
    return product_image_videos;
};