const { Op, Sequelize } = require('sequelize');
//const { Sequelize } = require('../../../models');
const OrderItemDelivery = require('../../../models').order_item_delivery;
// const OrderDeliveryAgent = require("../../models").order_delivery_agent;
const Products = require("../../../models").products;
const ImgVideos = require("../../../models").product_image_videos;
const moment = require('moment');


/**
 * 
 * @param {*} data
 * @param {*} t
 * @returns 
 */
function createOrderItemDeliveryT(data, t) {
    return OrderItemDelivery.create(data, { transaction: t });
}

/**
 * 
 * @param {*} data 
 * @param {*} t
 * @returns 
 */
function bulkCreateOrderItemDeliveryT(data, t) {
    return OrderItemDelivery.bulkCreate(data, { transaction: t });
}
function bulkCreateOrderItemDeliveryWT(data) {
    return OrderItemDelivery.bulkCreate(data);
}

/**
 * 
 * @param {*} customer_id 
 * @param {*} zip_code 
 * @param {*} startDate 
 * @param {*} endDate 
 * @returns 
 */
function getCalenderData(customer_id, zip_code, startDate, endDate) {
    console.log("startDate",startDate,endDate)
    return OrderItemDelivery.findAndCountAll({
        where: {
            customer_id,
            zip_code,
            delivery_date: {
                [Op.between]: [
                    startDate + "T00:00:00.000Z",
                    endDate + "T23:59:59.999Z"
                ]
            }
        },
        include: [
            {
                model: ImgVideos,
                as: 'product_images',
                required: false,
                attributes: ['id', 'product_id', 'type', 'url', 'position', 'is_active'],
                where: { is_active: true }
            },

        ],
        attributes: ['id', 'delivery_date', 'order_id', 'order_type', 'product_id', 'product_name','delivery_date','delivery_time','delivery_status','quantity','amount_to_be_collected'],
        order: [[Sequelize.col('delivery_date'), 'DESC']],
        // group: [Sequelize.col('id'), Sequelize.col('delivery_date')]
    });
}


/**
 * Get OrderItemDelivery details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
    return OrderItemDelivery.findOne({
        where: { id },
    });
}

/**
 * Get OrderItemDelivery details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
    return OrderItemDelivery.findAll(object);
}

function checkAlreadyExits(orderId, deliveryAgentId) {
    return OrderItemDelivery.findOne({
        where: {
            [Op.and]: {
                order_id: orderId,
                delivery_agent_id: deliveryAgentId
            }

        }
    });
}

/**
 * Find all the OrderItemDeliverys
 */
function findAll(offset, limit) {
    return OrderItemDelivery.findAll({ offset, limit });
}

/**
 * Create OrderItemDelivery.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
    return OrderItemDelivery.create(data);
}

/**
 * Update OrderItemDelivery.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
    return OrderItemDelivery.update(data, { where: { id }, returning: true });
}

/**
 * Soft delete OrderItemDelivery.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function softDelete(id) {
    return OrderItemDelivery.destroy({
        where: {
            id,
        },
    });
}
function findByOrderId(id) {
    return OrderItemDelivery.findAll({
        where: {
            order_id: id,
        },
        attributes: {
            exclude: ['created_by', 'updated_by', 'deleted_by', 'updatedAt', 'deletedAt', 'createdBy', 'updatedBy', 'createdAt']
        },
        order: [['id', 'DESC']]
    });
}

function findAllWithAttributesAndPagination(attributes, offset, limit) {
    return OrderItemDelivery.findAndCountAll({
        attributes: {
            exclude: ['created_by', 'updated_by', 'deleted_by', 'updatedAt', 'deletedAt', 'createdBy', 'updatedBy', 'createdAt']
        },
        offset, limit, order: [['id', 'DESC']]
    })
}
function getDeliverablesItems(attributes, offset, limit, query) {

    let queryArr = [];
    let newObj = {};
    if (query.order_id) {
        newObj = { order_id: query.order_id };
        queryArr.push(newObj);
    }
    if (query.category_id) {
        newObj = { category_id: parseInt(query.category_id) };
        queryArr.push(newObj);
    }
    if (query.product_name) {
        newObj = { product_name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('product_name')), 'LIKE', '%' + query.product_name.toLowerCase() + '%') };
        queryArr.push(newObj);
    }
    if (query.order_type) {
        newObj = { order_type: query.order_type };
        queryArr.push(newObj);
    }

    if (query.from_date || query.to_date) {
        newObj = {
            "createdAt": {
                [Op.between]: [
                    query.from_date + "T00:00:00.000Z",
                    query.to_date + "T23:59:59.999Z"
                ]
            }
        }
        queryArr.push(newObj);
    }

    return OrderItemDelivery.findAndCountAll({
        attributes: {
            exclude: ['created_by', 'updated_by', 'deleted_by', 'updatedAt', 'deletedAt', 'createdBy', 'updatedBy']
        },
        where: {
            delivery_agent_id: null,
            [Op.and]: queryArr,
        },
        offset, limit, order: [['id', 'DESC']]
    })
}

function findByOrderIdAndDeliveryDate(id) {
    return OrderItemDelivery.findAll({
        where: {
            order_id: id,
            delivery_date: {
                [Op.gt]: moment().toDate()
            },
            delivery_status: ['DELIVERY_CREATED', 'DELIVERY_PENDING']
        },
        attributes: ['id', 'order_id', 'delivery_date'],
        order: [['id', 'DESC']]
    });
}

function findByDateOidPidCid(order_id, customer_id, product_id, delivery_date) {
    return OrderItemDelivery.findOne({
        where: {
            order_id,
            customer_id,
            product_id,
            delivery_date: {
                [Op.eq]: new Date(delivery_date)
              }
        },
        attributes: ['id', 'order_id', 'delivery_date']
    });
}

function findByOrderIdAndDeliveryStatus(id) {
    return OrderItemDelivery.findAll({
        where: {
            order_id: id,
            delivery_status: ['DELIVERY_CREATED', 'DELIVERY_PENDING']
        },
        attributes: ['id', 'order_id', 'delivery_date'],
        order: [['id', 'DESC']]
    });
}

module.exports = {
    createOrderItemDeliveryT,
    bulkCreateOrderItemDeliveryT,
    getCalenderData,
    findById,
    findBy,
    findAll,
    create,
    update,
    softDelete,
    checkAlreadyExits,
    findByOrderId,
    findAllWithAttributesAndPagination,
    getDeliverablesItems,
    bulkCreateOrderItemDeliveryWT,
    findByOrderIdAndDeliveryDate,
    findByDateOidPidCid,
    findByOrderIdAndDeliveryStatus
}