const User = require('../../models').users;
const { Op, Sequelize } = require('sequelize');
const userAddress = require('../../models').user_addresses;
const Language = require('../../models').language;
const OrderModel = require('../../models').orders;


/**
 * Get user details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
    return User.findOne({
        where: { id },
    });
}

/**
 * Get user details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
    return User.findAll(object);
}

/**
 * Find all the users
 */
function findAll() {
    return User.findAll();
}

/**
 * Create user.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return User.create(data);
}

/**
 * Update user.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return User.update(data, { where: { id }, returning: true });
}

function findByPhoneNumber(phone_number) {
    return User.findOne({
        where: {
            phone_number
        },
        attributes: ['id', 'is_phone_verified', 'fcmToken', 'phone_verification_token','active'],
        include: [
            {
                model: Language,
                required: false,
                as: 'user_language'
            }
        ]
    })
}

function findAllWithAttributes(attributes) {
    return User.findAll({
        attributes: attributes
    })
}

function findAllWithAttributesAndPagination(attributes, offset, limit, query) {
    let queryArr = [];
    let newObj = {};
    let agentquery = {};

    if (query.user_name) {
        newObj = { name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', '%' + query.user_name.toLowerCase() + '%') };
        queryArr.push(newObj);
    }
    if (query.user_phone) {
        newObj = { phone_number: query.user_phone };
        queryArr.push(newObj);
    }
    if (query.user_email) {
        newObj = { email: (query.user_email) };
        queryArr.push(newObj);
    }

    return User.findAndCountAll({
        where: {
            [Op.and]: queryArr
        },
        attributes: attributes,
        offset, limit,
        order: [['createdAt', 'DESC']]
    })
}


function findOneWithAttributes(object, attributes) {
    return User.findOne({
        where: object,
        attributes: attributes,
        include: [{
            model: userAddress,
            required: false,
            attributes: {
                exclude: ['created_by', 'updated_by', 'deleted_by', 'updatedAt', 'deletedAt']
            },
            as: 'user_addresses'
        }, {
          model: OrderModel,
          attributes: ['id', 'order_id', 'createdAt', 'updatedAt'],
          required: false,
          as: "customer_orders",
          order: [['createdAt', 'DESC']],
          limit: 1
        }]
    });
}

function searchUserWithAddress(query, attributes, limit, page) {
    return User.findAndCountAll({
        distinct: true,
        where: {
            [Op.or]: [
                { name: { [Op.like]: query } },
                { email: { [Op.like]: query } },
                { phone_number: { [Op.like]: query } }
            ]
        },
        attributes, limit, page,
        include: [
            {
                model: userAddress,
                required: false,
                attributes: {
                    exclude: ['created_by', 'updated_by', 'deleted_by', 'updatedAt', 'deletedAt']
                },
                as: 'user_addresses'
            }
        ]
    });
}

/**
 * Get user details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findByIdAssociateLanguage(id) {
    return User.findOne({
        where: { id },
        include: [
            {
                model: Language,
                required: false,
                as: 'user_language'
            }
        ]
    });
}

/**
 * Check unique language code.
 * @param {*} type
 * @param {*} value
 * @returns {Promise}
 */
function checkUniqueUserAttribute(type, value) {
    return User.findOne({
        where: { [type]: value },
        attributes: [type]
    });
}

function checkUniqueUserAttributeUpdate(type, value, id) {
    return User.findOne({
        where: {
            [type]: value,
            id: { [Op.ne]: id }
        },
        attributes: [type]
    });
}

function findUserWithAddress(id) {
    return User.findOne({
        where: {
            id
        },
        include: [
            {
                model: userAddress,
                required: false,
                attributes: {
                    exclude: ['created_by', 'updated_by', 'deleted_by', 'updatedAt', 'deletedAt']
                },
                as: 'user_addresses'
            }
        ]
    });
}


module.exports = {
    findById,
    findBy,
    findAll,
    create,
    update,
    findByPhoneNumber,
    findAllWithAttributes,
    findOneWithAttributes,
    findAllWithAttributesAndPagination,
    searchUserWithAddress,
    findByIdAssociateLanguage,
    checkUniqueUserAttribute,
    checkUniqueUserAttributeUpdate,
    findUserWithAddress
}