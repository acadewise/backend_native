const Category = require('../../models').categories;
const configRules = require('../../models').configuration_rules;
const Attribute = require('../../models').attributes;
const AttributeValue = require("../../models").attribute_values;
const { Op, Sequelize } = require('sequelize');


/**
 * Get Category details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
    return Category.findOne({
        where: { id },
    });
}

/**
 * Get Category details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
    return Category.findAll(object);
}

/**
 * Find all the users
 */
function findAll() {
    return Category.findAll();
}

/**
 * Create Category.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return Category.create(data);
}

/**
 * Update Category.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return Category.update(data, { where: { id }, returning: true });
}


function findAllWithAttributes(attributes) {
    return Category.findAll({
        attributes: attributes
    })
}

function findAllWithRules(offset, limit) {
    return Category.findAndCountAll({
        offset, limit, distinct: true,
        include: [
            {
                model: configRules,
                as: 'cat_config_rules',
                through: {
                    attributes: ['id', 'rule_id', 'category_id', 'is_active'],
                    where: { is_active: true }
                },
                required: false,
            },
            {
                model: Category,
                as: 'sub_category',
                required: false,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'created_by', 'updated_by', 'deleted_by'] },
            }
        ],
        where: { parent_id: 0 },
        order: [['id', 'DESC']]
    })
}

/**
 * 
 * @param {*} customObj 
 * @returns 
 */
function findAllCategoryWithObject(customObj) {
    return Category.findAndCountAll(customObj);
}

function findOneWithRules(object) {
    return Category.findOne({
        where: object,
        include: [
            {
                model: configRules,
                as: 'cat_config_rules',
                through: {
                    attributes: ['id', 'rule_id', 'category_id', 'is_active'],
                    where: { is_active: true }
                },
                required: false
            }
        ]
    });
}

function softDelete(id) {
    return Category.destroy({
        where: {
            id
        }
    });
}

/**
 * Get category attributes and values.
 * @param {*} id 
 */
function getCatAttVal(id) {
    return Category.findOne({
        where: { id },
        include: [
            {
                model: Attribute,
                as: 'cat_attributes',
                required: false,
                include: [
                    {
                        model: AttributeValue,
                        as: 'attribute_values',
                        required: true
                    }
                ]
            },
            {
                model: configRules,
                as: 'cat_config_rules',
                required: false
            }
        ]
    });
}

/**
 * Check unique category name.
 * @param {Number} name
 * @returns {Promise}
 */
function checkUniqueCatName(name) {
    return Category.findOne({
        where: { name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', '%' + name.toLowerCase() + '%') },
        attributes: ['name']
    });
}

function checkUniqueCategoryAttributeUpdate(type, value, id) {
    return Category.findOne({
        where: {
            [type]: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col(type)), '=', '' + value.toLowerCase() + ''),
            id: { [Op.ne]: id }
        },
        attributes: [type]
    });
}

module.exports = {
    findById,
    findBy,
    findAll,
    create,
    update,
    findAllWithAttributes,
    findOneWithRules,
    findAllWithRules,
    softDelete,
    getCatAttVal,
    findAllCategoryWithObject,
    checkUniqueCatName,
    checkUniqueCategoryAttributeUpdate
}