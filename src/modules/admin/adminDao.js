const Admin = require('../../models').admins
const Role = require('../../models').roles
const DeliveryRouteAgent = require('../../models').delivery_route_agent
const { Op, Sequelize } = require('sequelize');

/**
 * Get user details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
    return Admin.findOne({
        where: { id }
    });
}

/**
 * Get user details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
    return Admin.findAll(object);
}

/**
 * Find all the users
 */
function findAll() {
    return Admin.findAll();
}

/**
 * Create user.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return Admin.create(data);
}

/**
 * Update user.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return Admin.update(data, { where: { id }, returning: true });
}
/**
 * 
 * @param {*} email 
 * @returns 
 */
function findByEmailId(email) {
    return Admin.findOne({
        where: {
            email
        },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt','created_by','updated_by','deleted_by'] }
    })
}

/**
 * 
 * @param {*} email 
 * @param {*} id 
 * @returns 
 */
function findByEmailIdWithRole(email, id) {
    return Admin.findOne({
        where: {
            email,
            id
        },
        attributes: ['id', 'email', 'password'],
        include: [
            {
                model: Role,
                as: 'roles',
                required: true
            }
        ]
    })
}

/**
 * 
 * @param {*} attributes 
 * @returns 
 */
function findAllWithAttributes(attributes) {
    return Admin.findAll({
        attributes: attributes
    })
}

/**
 * 
 * @param {*} attributes 
 * @param {*} offset 
 * @param {*} limit 
 * @returns 
 */
function findAllWithAttributesAndPagination(attributes, offset, limit, query) {
    let queryArr = [];
    let newObj = {};
    let agentquery  =   {};
    
    if (query.uname) {
        newObj = { name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('admins.name')), 'LIKE', '%' + query.uname.toLowerCase() + '%') };
        queryArr.push(newObj);
    }
    if (query.phone_number) {
        newObj = { phone_number: query.phone_number };
        queryArr.push(newObj);
    }
    if (query.user_role) {
        newObj = { role: parseInt(query.user_role) };
        queryArr.push(newObj);
    }
    if (query.route_id) {
        agentquery = { route_id: parseInt(query.route_id) };
    }

    return Admin.findAndCountAll({
        attributes: attributes,
        offset, limit, order: [['createdAt', 'DESC']],
        include: [
            {
                model: Role,
                as: 'role_detail',
                required: true,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
            },
            {
                model: DeliveryRouteAgent,
                as: 'delivery_route',
                required: false,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                where: agentquery
                
            },
        ],
        where: {
            [Op.and]: queryArr
        }

    })
}

/**
 * 
 * @param {*} object 
 * @param {*} attributes 
 * @returns 
 */
function findOneWithAttributes(object, attributes) {

    return Admin.findOne({
        where: object,
        attributes: attributes,
        include: [
            {
                model: Role,
                as: 'role_detail',
                required: true,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
            },
            {
                model: DeliveryRouteAgent,
                as: 'delivery_route',
                required: false,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
            },
        ]
    });
}

/**
 * Check unique admin email.
 * @param {Number} email
 * @returns {Promise}
 */
function checkUniqueAdminEmail(email) {
    return Admin.findOne({
        where: { email },
        attributes: ['email']
    });
}

module.exports = {
    findById,
    findBy,
    findAll,
    create,
    update,
    findByEmailId,
    findAllWithAttributes,
    findAllWithAttributesAndPagination,
    findOneWithAttributes,
    findByEmailIdWithRole,
    checkUniqueAdminEmail
}