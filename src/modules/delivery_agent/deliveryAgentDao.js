const OrderItemDelivery = require("../../models").order_item_delivery;
const Order = require("../../models").orders;
const Users = require("../../models").users;
const Admin = require("../../models").admins;
const Category = require("../../models").categories;
const DeliveryPointAddresss = require("../../models").delivery_point_address;
const DeliveryRouteAgent = require("../../models").delivery_route_agent;
const DeliveryRoute = require("../../models").delivery_route;
const { Op, Sequelize } = require('sequelize');



/**
 * Find all the OrderItemDeliverys
 */
function findAll(offset, limit) {
  return OrderItemDelivery.findAll({ offset, limit });
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
 * 
 * @param {*} attributes 
 * @param {*} offset 
 * @param {*} limit 
 * @returns 
 */
function findAllOrderDeliveryAgentPagination(query, offset, limit) {

  const delivery_agent_id = query.agent_id || null;
  const route_id = query.route_id || null;

  let newObj = {};
  let qrArr = [{
    "delivery_agent_id": delivery_agent_id,
  }];
  if (query.order_date) {
    newObj = {
      "delivery_date": { [Op.eq]: query.order_date + "T00:00:00.000Z" }
    };
    qrArr.push(newObj);
  }
  if (query.delivery_status) {
    newObj = {
      "delivery_status": query.delivery_status
    };
    qrArr.push(newObj);
  }
  if (query.route_id) {
    newObj = {
      "route_id": query.route_id
    };
    qrArr.push(newObj);
  }

  return OrderItemDelivery.findAndCountAll({
    where: qrArr,
    include: [
      {
        model: Order,
        as: 'order_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      },
      {
        model: Users,
        as: 'customer_details',
        required: false,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password', 'login_pin', 'is_login_pin_active',
            'is_fingerprint_active',
            'fingerprint',
            'last_login',
            'fcmToken',
            'system_properties',
            'phone_verification_token',
            'email_verification_token',
            'is_email_verified',
            'is_phone_verified',
            'google_id',
            'facebook_id',
            'invitedBy',
            'language_id'
          ]
        },
      },
      {
        model: DeliveryPointAddresss,
        as: 'pickup_address_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      },
      {
        model: Category,
        as: 'category_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      }
    ],
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    offset, limit,
    order: [['id', "DESC"]],

  })
}


function findAllDeliveryReportsAndPagination(query, offset, limit) {
  let queryArr = [];
  let newObj = {};
  if (query.category_id) {
    newObj = { category_id: query.category_id };
    queryArr.push(newObj);
  }
  if (query.delivery_agent_id) {
    newObj = { delivery_agent_id: query.delivery_agent_id };
    queryArr.push(newObj);
  }
  if (query.route_id) {
    newObj = { route_id: query.route_id };
    queryArr.push(newObj);
  }
  if (query.delivery_status) {
    newObj = { delivery_status: query.delivery_status };
    queryArr.push(newObj);
  }
  if (query.order_type) {
    newObj = { order_type: query.order_type };
    queryArr.push(newObj);
  }

  if (query.from_date || query.to_date) {
    newObj = {
      "delivery_date": {
        [Op.between]: [
          query.from_date + "T00:00:00.000Z",
          query.to_date + "T23:59:59.999Z"
        ]
      }
    }
    queryArr.push(newObj);
  }
  console.log("queryArr==>", queryArr)
  return OrderItemDelivery.findAndCountAll({
    where: {
      [Op.and]: queryArr
    },
    include: [
      {
        model: Order,
        as: 'order_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      },
      {
        model: Users,
        as: 'customer_details',
        required: false,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password', 'login_pin', 'is_login_pin_active',
            'is_fingerprint_active',
            'fingerprint',
            'last_login',
            'fcmToken',
            'system_properties',
            'phone_verification_token',
            'email_verification_token',
            'is_email_verified',
            'is_phone_verified',
            'google_id',
            'facebook_id',
            'invitedBy',
            'language_id'
          ]
        },
      },
      {
        model: DeliveryPointAddresss,
        as: 'pickup_address_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      },
      {
        model: Admin,
        as: 'delivery_agent_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password', 'created_by', 'updated_by', 'deleted_by'] },
      },
      {
        model: Category,
        as: 'category_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      }
    ],
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    offset, limit,
    order: [['id', "DESC"]]
  })
}

function findAllDeliveryItemsReportsAndPagination(query, offset, limit) {
  let queryArr = [];
  let newObj = {};
  if (query.category_id) {
    newObj = { category_id: query.category_id };
    queryArr.push(newObj);
  }
  if (query.delivery_agent_id) {
    newObj = { delivery_agent_id: query.delivery_agent_id };
    queryArr.push(newObj);
  }
  if (query.route_id) {
    newObj = { route_id: query.route_id };
    queryArr.push(newObj);
  }
  if (query.delivery_status) {
    newObj = { delivery_status: query.delivery_status };
    queryArr.push(newObj);
  }

  if (query.order_type) {
    newObj = { order_type: query.order_type };
    queryArr.push(newObj);
  }

  if (query.from_date || query.to_date) {
    newObj = {
      "delivery_date": {
        [Op.between]: [
          query.from_date + "T00:00:00.000Z",
          query.to_date + "T23:59:59.999Z"
        ]
      }
    }
    queryArr.push(newObj);
  }
  return OrderItemDelivery.findAndCountAll({
    where: {
      [Op.and]: queryArr
    },
    include: [
      {
        model: Order,
        as: 'order_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      },
      {
        model: Users,
        as: 'customer_details',
        required: false,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password', 'login_pin', 'is_login_pin_active',
            'is_fingerprint_active',
            'fingerprint',
            'last_login',
            'fcmToken',
            'system_properties',
            'phone_verification_token',
            'email_verification_token',
            'is_email_verified',
            'is_phone_verified',
            'google_id',
            'facebook_id',
            'invitedBy',
            'language_id'
          ]
        },
      },
      {
        model: DeliveryPointAddresss,
        as: 'pickup_address_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      },
      {
        model: Admin,
        as: 'delivery_agent_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password', 'created_by', 'updated_by', 'deleted_by'] },
      },
      {
        model: Category,
        as: 'category_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      }
    ],
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    offset, limit,
    order: [['id', "DESC"]]
  })
}

function checkAlreadyExits(id, orderId, userID, deliveryAgentId) {
  return OrderItemDelivery.findOne({
    where: {
      [Op.and]: {
        id: id,
        order_id: orderId,
        customer_id: userID,
        delivery_agent_id: deliveryAgentId
      }

    }
  });
}


function findDeliveryAgentRoutes(delivery_agent_id, offset, limit) {

  return DeliveryRouteAgent.findAndCountAll({
    where: {
      agent_id: delivery_agent_id
    },
    include: [
      {
        model: DeliveryRoute,
        as: 'route_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'created_by', 'updated_by', 'deleted_by', 'password'] },
        // where: { is_active: true }

      }
    ],
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    offset, limit,
    order: [['id', "DESC"]],

  })
}

module.exports = {
  findAll,
  update,
  findAllOrderDeliveryAgentPagination,
  checkAlreadyExits,
  findAllDeliveryReportsAndPagination,
  findAllDeliveryItemsReportsAndPagination,
  findDeliveryAgentRoutes
};
