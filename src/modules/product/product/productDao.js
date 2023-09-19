const { Op, Sequelize } = require('sequelize');
const { sequelize } = require('../../../models');
const Tag = require('../../../models').tags;
const Unit = require("../../../models").units;
const Product = require('../../../models').products;
const Category = require('../../../models').categories;
const Attribute = require('../../../models').attributes;
const ImgVideos = require("../../../models").product_image_videos;
const AttributeValue = require("../../../models").attribute_values;
const ConfigRules = require("../../../models").configuration_rules;
const userWishlist = require('../../../models').user_product_wishlist;

/**
 * Get product details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
    return Product.findOne({
        where: { id },
    });
}

/**
 * Get product details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
    return Product.findAll(object);
}

/**
 * Find all the products
 */
function findAll() {
    return Product.findAll();
}

/**
 * Create product.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return Product.create(data);
}

/**
 * Create product with transaction.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function createT(data) {
    return Product.create(data, { transaction: t });
}

/**
 * Update product.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return Product.update(data, { where: { id }, returning: true });
}

/**
 * Update product.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function updateT(id, data, t) {
    return Product.update(data, { where: { id }, transaction: t, returning: true });
}


function findAllWithAttributes(attributes) {
    return Product.findAll({
        attributes: attributes
    })
}

function findAllWithAttributesAndPagination(attributes, offset, limit) {
    return Product.findAndCountAll({
        where: { is_active: true },
        attributes: attributes,
        offset, limit, distinct: true,
        include: [
            {
                model: ImgVideos,
                as: 'product_images',
                required: false,
                attributes: ['id', 'product_id', 'type', 'url', 'position', 'is_active'],
                where: { is_active: true }
            },
            {
                model: Attribute,
                as: 'prod_attributes',
                required: true,
                attributes: ['id', 'name', 'slug', 'image', 'order', 'is_default'],
                through: {
                    where: {
                        is_active: true
                    }
                },
                include: [
                    {
                        model: AttributeValue,
                        as: 'prod_attr_values',
                        required: true,
                        attributes: ['id', 'attribute_id', 'label', 'value', 'image', 'order', 'is_default', 'is_active'],
                        through: {
                            where: {
                                is_active: true
                            }
                        }
                    }
                ]
            }
        ]
    })
}

function getAllProductsWithRelationships(offset, limit) {
    return Product.findAndCountAll({
        offset, limit, distinct: true,
        include: [
            {
                model: Unit,
                as: 'prod_measurement_unit',
                attributes: ['id', 'name', 'slug', 'is_active']
            },
            {
                model: ImgVideos,
                as: 'product_images',
                required: false,
                attributes: ['id', 'product_id', 'type', 'url', 'position', 'is_active'],
                where: { is_active: true }
            },
            {
                model: Category,
                as: 'prod_categories',
                required: false,
                through: {
                    attributes: ['id', 'product_id', 'category_id', 'is_active'],
                    where: { is_active: true }
                }
            },
            {
                model: Tag,
                as: 'prod_tags',
                required: false,
                through: {
                    attributes: ['id', 'tag_id', 'item_id', 'is_active'],
                    where: { is_active: true }
                }
            },
            {
                model: ConfigRules,
                required: false,
                as: 'prod_conf_rules',
                through: {
                    attributes: ['id', 'rule_id', 'product_id', 'is_active'],
                    where: { is_active: true }
                }
            },
            {
                model: AttributeValue,
                as: 'prod_attr_values',
                through: {
                    attributes: ['id', 'product_id', 'attribute_id', 'attribute_value_id', 'is_active'],
                    where: { is_active: true }
                },
                include: [
                    {
                        model: Attribute,
                        as: 'value_attribute',
                    }
                ]
            }
        ],
        order: [['id', 'DESC']]
    })
}


function findOneWithAttributes(object, attributes) {
    return Product.findOne({
        where: object,
        attributes: attributes
    });
}

function findOneWithRelationships(object, attributes) {
    return Product.findOne({
        where: object,
        attributes,
        include: [
            {
                model: Unit,
                as: 'prod_measurement_unit',
                attributes: ['id', 'name', 'slug', 'is_active']
            },
            {
                model: ImgVideos,
                as: 'product_images',
                required: false,
                attributes: ['id', 'product_id', 'type', 'url', 'position', 'is_active'],
                where: { is_active: true }
            },
            {
                model: Category,
                as: 'prod_categories',
                required: false,
                through: {
                    attributes: ['id', 'product_id', 'category_id', 'is_active'],
                    where: { is_active: true }
                }
            },
            {
                model: Tag,
                as: 'prod_tags',
                required: false,
                through: {
                    attributes: ['id', 'tag_id', 'item_id', 'is_active'],
                    where: { is_active: true }
                }
            },
            {
                model: ConfigRules,
                required: false,
                as: 'prod_conf_rules',
                through: {
                    attributes: ['id', 'rule_id', 'product_id', 'is_active'],
                    where: { is_active: true }
                }
            },
            {
                model: AttributeValue,
                as: 'prod_attr_values',
                attributes: ['id', 'attribute_id', 'label', 'value', 'image', 'order', 'is_default', 'is_active'],
                through: {
                    attributes: ['id', 'product_id', 'attribute_id', 'attribute_value_id', 'is_active'],
                    where: { is_active: true }
                },
                include: [
                    {
                        model: Attribute,
                        as: 'value_attribute',
                        attributes: ['id', 'name', 'slug', 'image', 'order', 'is_default']
                    }
                ]
            }
        ]
    });
}

function softDelete(id) {
    return Product.destroy({ where: { id } });
}

function softDeleteT(id, t) {
    return Product.destroy({ where: { id }, transaction: t });
}

function searchWithRelation(query, limit, page) {
    return Product.findAndCountAll({
        distinct: true,
        where: {
            [Op.or]: [
                { name: { [Op.like]: query } },
                { sku: { [Op.like]: query } }
            ]
        },
        attributes: { exclude: ['created_by', 'updated_by', 'deleted_by', 'updatedAt', 'deletedAt'] },
        limit, page,
        include: [
            {
                model: Unit,
                as: 'prod_measurement_unit',
                attributes: ['id', 'name', 'slug', 'is_active']
            },
            {
                model: ImgVideos,
                as: 'product_images',
                required: false,
                attributes: ['id', 'product_id', 'type', 'url', 'position', 'is_active'],
                where: { is_active: true }
            },
            {
                model: Category,
                as: 'prod_categories',
                required: false,
                through: {
                    attributes: ['id', 'product_id', 'category_id', 'is_active'],
                    where: { is_active: true }
                }
            },
            {
                model: Tag,
                as: 'prod_tags',
                required: false,
                through: {
                    attributes: ['id', 'tag_id', 'item_id', 'is_active'],
                    where: { is_active: true }
                }
            },
            {
                model: ConfigRules,
                required: false,
                as: 'prod_conf_rules',
                through: {
                    attributes: ['id', 'rule_id', 'product_id', 'is_active'],
                    where: { is_active: true }
                }
            },
            {
                model: AttributeValue,
                as: 'prod_attr_values',
                through: {
                    attributes: ['id', 'product_id', 'attribute_id', 'attribute_value_id', 'is_active'],
                    where: { is_active: true }
                },
                include: [
                    {
                        model: Attribute,
                        as: 'value_attribute',
                    }
                ]
            }
        ],
        order: [['id', 'DESC']]
    });
}

function findOneAndRel(object, attributes, userId = null) {
    const customInclude = [{
        model: Unit,
        as: 'prod_measurement_unit',
        attributes: ['id', 'name', 'slug', 'is_active']
    },
    {
        model: ImgVideos,
        as: 'product_images',
        required: false,
        attributes: ['id', 'product_id', 'type', 'url', 'position', 'is_active'],
        where: { is_active: true }
    },
    {
        model: Category,
        as: 'prod_categories',
        required: false,
        through: {
            attributes: ['id', 'product_id', 'category_id', 'is_active'],
            where: { is_active: true }
        }
    },
    {
        model: Tag,
        as: 'prod_tags',
        required: false,
        through: {
            attributes: ['id', 'tag_id', 'item_id', 'is_active'],
            where: { is_active: true }
        }
    },
    {
        model: ConfigRules,
        required: false,
        as: 'prod_conf_rules',
        through: {
            attributes: ['id', 'rule_id', 'product_id', 'is_active'],
            where: { is_active: true }
        }
    },
    {
        model: Attribute,
        as: 'prod_attributes',
        required: false,
        attributes: ['id', 'name', 'slug', 'image', 'order', 'is_default'],
        through: {
            where: {
                product_id: object.id,
                is_active: true
            }
        },
        include: [
            {
                model: AttributeValue,
                as: 'prod_attr_values',
                required: true,
                attributes: ['id', 'attribute_id', 'label', 'value', 'image', 'order', 'is_default', 'is_active'],
                through: {
                    where: {
                        product_id: object.id,
                        is_active: true
                    }
                }
            }
        ]
    },
    {
        model: userWishlist,
        required: false,
        as: 'user_wishlist',
        where: {
            user_id: userId,
            is_active: true
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
    ];
    // if (userId) {
    //     customInclude.push({
    //         model: userWishlist,
    //         required: false,
    //         as: 'user_wishlist',
    //         where: {
    //             user_id: userId,
    //             is_active: true
    //         },
    //         attributes: { exclude: ['createdAt', 'updatedAt'] }
    //     });
    // }
    return Product.findOne({ where: object, attributes, include: customInclude });
}

/**
 * 
 * @param {*} rawQuery 
 * @returns 
 */
async function productRawQuery(rawQuery) {
    const data = await sequelize.query(rawQuery,
        {
            model: DeliveryRoute,
            mapToModel: true,
            raw: true,
            type: QueryTypes.SELECT
        });
    return data;
}

/**
 * 
 * @param {*} id 
 * @returns 
 */
function findDeliveryRoute(id) {
    return Product.findOne({
        where: { id, is_active: true },
    });
}

function searchWithName(query, limit, page) {
    return Product.findAndCountAll({
        distinct: true,
        subQuery: false,
        where: {
            [Op.or]: [
                {
                    name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + query + '%')
                },
                {
                    description: sequelize.where(sequelize.fn('LOWER', sequelize.col('description')), 'LIKE', '%' + query + '%')
                }
            ],
            is_active: true
        },
        attributes: ['id', 'name', 'description', 'is_on_sale', 'max_retail_price', 'special_sale_price'],
        limit, page,
        include: [
            {
                model: ImgVideos,
                as: 'product_images',
                required: true,
                attributes: ['url'],
                where: { is_active: true }
            }
        ]
    });
}

/**
 * Check unique product name.
 * @param {Number} name
 * @returns {Promise}
 */
function checkUniqueProductName(name) {
    return Product.findOne({
        where: { name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', '%' + name.toLowerCase() + '%') },
        attributes: ['name']
    });
}

function checkUniqueProductAttributeUpdate(type, value, id) {
    return Product.findOne({
        where: {
            [type]: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col(type)), 'LIKE', '%' + value.toLowerCase() + '%'),
            id: { [Op.ne]: id }
        },
        attributes: [type]
    });
}

const setProductQuantity = (param, t) => {

    let itemQuantity = parseFloat(param.quantity);

    let data = sequelize.query(
        "UPDATE products set stock_quantity = COALESCE(stock_quantity,0)-" + itemQuantity + " where id=" + param.product_id + "",
        {
            type: sequelize.QueryTypes.UPDATE,

        },
        {
            transaction: t
        }
    );
    return data;
}

function findWebAllWithAttributesAndPagination(attributes, offset, limit) {
    return Product.findAndCountAll({
        where: { is_active: true, show_on_web: true },
        attributes: attributes,
        offset, limit, distinct: true,
        include: [
            {
                model: ImgVideos,
                as: 'product_images',
                required: false,
                attributes: ['id', 'product_id', 'type', 'url', 'position', 'is_active'],
                where: { is_active: true }
            },
            {
                model: Attribute,
                as: 'prod_attributes',
                required: false,
                attributes: ['id', 'name', 'slug', 'image', 'order', 'is_default'],
                through: {
                    where: {
                        is_active: true
                    }
                },
                include: [
                    {
                        model: AttributeValue,
                        as: 'prod_attr_values',
                        required: false,
                        attributes: ['id', 'attribute_id', 'label', 'value', 'image', 'order', 'is_default', 'is_active'],
                        through: {
                            where: {
                                is_active: true
                            }
                        }
                    }
                ]
            }
        ]
    })
}

function findWebOneAndRel(object, attributes, userId = null) {
    const customInclude = [{
        model: Unit,
        as: 'prod_measurement_unit',
        attributes: ['id', 'name', 'slug', 'is_active']
    },
    {
        model: ImgVideos,
        as: 'product_images',
        required: false,
        attributes: ['id', 'product_id', 'type', 'url', 'position', 'is_active'],
        where: { is_active: true }
    },
    {
        model: Category,
        as: 'prod_categories',
        required: false,
        through: {
            attributes: ['id', 'product_id', 'category_id', 'is_active'],
            where: { is_active: true }
        }
    },
    {
        model: Tag,
        as: 'prod_tags',
        required: false,
        through: {
            attributes: ['id', 'tag_id', 'item_id', 'is_active'],
            where: { is_active: true }
        }
    },
    {
        model: ConfigRules,
        required: false,
        as: 'prod_conf_rules',
        through: {
            attributes: ['id', 'rule_id', 'product_id', 'is_active'],
            where: { is_active: true }
        }
    },
    {
        model: Attribute,
        as: 'prod_attributes',
        required: false,
        attributes: ['id', 'name', 'slug', 'image', 'order', 'is_default'],
        through: {
            where: {
                product_id: object.id,
                is_active: true
            }
        },
        include: [
            {
                model: AttributeValue,
                as: 'prod_attr_values',
                required: true,
                attributes: ['id', 'attribute_id', 'label', 'value', 'image', 'order', 'is_default', 'is_active'],
                through: {
                    where: {
                        product_id: object.id,
                        is_active: true
                    }
                }
            }
        ]
    },
    {
        model: userWishlist,
        required: false,
        as: 'user_wishlist',
        where: {
            is_active: true
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
    ];
    // if (userId) {
    //     customInclude.push({
    //         model: userWishlist,
    //         required: false,
    //         as: 'user_wishlist',
    //         where: {
    //             user_id: userId,
    //             is_active: true
    //         },
    //         attributes: { exclude: ['createdAt', 'updatedAt'] }
    //     });
    // }
    return Product.findOne({ where: object, attributes, include: customInclude });
}

module.exports = {
    findById,
    findBy,
    findAll,
    create,
    createT,
    update,
    updateT,
    findAllWithAttributes,
    findOneWithAttributes,
    findAllWithAttributesAndPagination,
    getAllProductsWithRelationships,
    findOneWithRelationships,
    softDelete,
    softDeleteT,
    searchWithRelation,
    findOneAndRel,
    productRawQuery,
    findDeliveryRoute,
    searchWithName,
    checkUniqueProductName,
    checkUniqueProductAttributeUpdate,
    setProductQuantity,
    findWebAllWithAttributesAndPagination,
    findWebOneAndRel
}