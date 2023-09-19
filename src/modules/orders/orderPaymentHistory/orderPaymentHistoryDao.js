const OrderPaymentHistory = require("../../../models").order_payment_history;
const { Op, Sequelize } = require("sequelize");
const Users = require("../../../models").users;

/**
 * Get OrderPaymentHistory details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return OrderPaymentHistory.findOne({
    where: { id },
  });
}

/**
 * Get OrderPaymentHistory details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return OrderPaymentHistory.findAll(object);
}

/**
 * Find all the OrderPaymentHistorys
 */
function findAll(offset, limit) {
  return OrderPaymentHistory.findAll({ offset, limit });
}

/**
 * Create OrderPaymentHistory.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return OrderPaymentHistory.create(data);
}

/**
 * Create OrderPaymentHistory.
 *
 * @param {Object} data
 * @param {Object} t
 * @returns {Promise}
 */
function createT(data, t) {
  return OrderPaymentHistory.create(data, { transaction: t });
}

/**
 * Update OrderPaymentHistory.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return OrderPaymentHistory.update(data, { where: { id }, returning: true });
}

/**
 * Bulk Create OrderPaymentHistory.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function bulkCreate(data) {
  return OrderPaymentHistory.bulkCreate(data, { returning: true });
}

function totalCreditAmount(query) {
  let queryArr = [];
  let newObj = {};
  let requireStatus = false;
  let queryOperator = "";

  if (query.customer_id) {
    newObj = { customer_id: query.customer_id };
    queryArr.push(newObj);
    requireStatus = true;
    queryOperator +=
      ` AND "order_payment_histories"."customer_id"='` +
      query.customer_id +
      `'`;
  }
  if (query.order_id) {
    newObj = { order_id: query.order_id };
    queryArr.push(newObj);
    requireStatus = true;
    queryOperator +=
      ` AND "order_payment_histories"."order_id"='` + query.order_id + `'`;
  }

  if (query.from_date || query.to_date) {
    newObj = {
      createdAt: {
        [Op.between]: [
          query.from_date + "T00:00:00.000Z",
          query.to_date + "T23:59:59.999Z",
        ],
      },

      // "createdAt": {
      //     [Op.lt]: new Date(new Date(query.to_date).getTime() + 60 * 60 * 24 * 1000 - 1),
      //     [Op.gt]: new Date(query.from_date)
      // }
    };
    queryArr.push(newObj);
    requireStatus = true;

    queryOperator +=
      ` AND "order_payment_histories"."createdAt" BETWEEN '` +
      query.from_date +
      "T00:00:00.000Z" +
      `' AND '` +
      query.to_date +
      "T23:59:59.999Z" +
      `'`;
  }

  return OrderPaymentHistory.findAll({
    where: {
      [Op.and]: queryArr,
    },
    attributes: [
      "order_id",
      [
        Sequelize.literal(
          `(select sum(amount) from order_payment_histories where "order_payment_histories"."amount_type" = 'CR' AND "order_payment_histories"."payment_note"='DUE'` +
            queryOperator +
            `)`
        ),
        "cr_due",
      ],
      [
        Sequelize.literal(
          `(select sum(amount) from order_payment_histories where "order_payment_histories"."amount_type" = 'CR' AND "order_payment_histories"."payment_note"='ADVANCE'` +
            queryOperator +
            `)`
        ),
        "cr_advance",
      ],
      [
        Sequelize.literal(
          `(select sum(amount) from order_payment_histories where "order_payment_histories"."amount_type" = 'CR' AND "order_payment_histories"."payment_note"='ADJUSTMENT'` +
            queryOperator +
            `)`
        ),
        "cr_adjustment",
      ],
      [
        Sequelize.literal(
          `(select sum(amount) from order_payment_histories where "order_payment_histories"."amount_type" = 'CR' AND "order_payment_histories"."payment_note"='REFUND'` +
            queryOperator +
            `)`
        ),
        "cr_refund",
      ],
    ],
    group: Sequelize.col("order_payment_history.order_id"),
    raw: true,
  });
}

function totalDebitAmount(query) {
  let queryArr = [];
  let newObj = {};
  let requireStatus = false;
  let queryOperator = "";

  if (query.customer_id) {
    newObj = { customer_id: query.customer_id };
    queryArr.push(newObj);
    requireStatus = true;
    queryOperator +=
      ` AND "order_payment_histories"."customer_id"='` +
      query.customer_id +
      `'`;
  }
  if (query.order_id) {
    newObj = { order_id: query.order_id };
    queryArr.push(newObj);
    requireStatus = true;
    queryOperator +=
      ` AND "order_payment_histories"."order_id"='` + query.order_id + `'`;
  }

  if (query.from_date || query.to_date) {
    newObj = {
      createdAt: {
        [Op.between]: [
          query.from_date + "T00:00:00.000Z",
          query.to_date + "T23:59:59.999Z",
        ],
      },
    };
    queryArr.push(newObj);
    requireStatus = true;

    queryOperator +=
      ` AND "order_payment_histories"."createdAt" BETWEEN '` +
      query.from_date +
      "T00:00:00.000Z" +
      `' AND '` +
      query.to_date +
      "T23:59:59.999Z" +
      `'`;
  }

  return OrderPaymentHistory.findAll({
    where: {
      [Op.and]: queryArr,
    },
    attributes: [
      "order_id",
      [
        Sequelize.literal(
          `(select sum(amount) from order_payment_histories where "order_payment_histories"."amount_type" = 'DR' AND "order_payment_histories"."payment_note"='DUE'` +
            queryOperator +
            `)`
        ),
        "dr_due",
      ],
      [
        Sequelize.literal(
          `(select sum(amount) from order_payment_histories where "order_payment_histories"."amount_type" = 'DR' AND "order_payment_histories"."payment_note"='ADVANCE'` +
            queryOperator +
            `)`
        ),
        "dr_advance",
      ],
      [
        Sequelize.literal(
          `(select sum(amount) from order_payment_histories where "order_payment_histories"."amount_type" = 'DR' AND "order_payment_histories"."payment_note"='ADJUSTMENT'` +
            queryOperator +
            `)`
        ),
        "dr_adjustment",
      ],
      [
        Sequelize.literal(
          `(select sum(amount) from order_payment_histories where "order_payment_histories"."amount_type" = 'DR' AND "order_payment_histories"."payment_note"='REFUND'` +
            queryOperator +
            `)`
        ),
        "dr_refund",
      ],
    ],
    group: Sequelize.col("order_payment_history.order_id"),
    raw: true,
  });
}

function findAllHistory(query, attributes, offset, limit) {
  let queryArr = [];
  let newObj = {};
  if (query.customer_id) {
    newObj = { customer_id: query.customer_id };
    queryArr.push(newObj);
  }

  if (query.order_id) {
    newObj = { order_id: query.order_id };
    queryArr.push(newObj);
  }
  if (query.amount_type) {
    newObj = { amount_type: query.amount_type };
    queryArr.push(newObj);
  }
  if (query.payment_note) {
    newObj = { payment_note: query.payment_note };
    queryArr.push(newObj);
  }

  if (query.from_date || query.to_date) {
    newObj = {
      createdAt: {
        [Op.between]: [
          query.from_date + "T00:00:00.000Z",
          query.to_date + "T23:59:59.999Z",
        ],
      },
    };
    queryArr.push(newObj);
  }

  return OrderPaymentHistory.findAndCountAll({
    attributes: attributes,
    where: {
      [Op.and]: queryArr,
    },
    include: [
      {
        model: Users,
        as: "customer_details",
        required: false,
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "deletedAt",
            "password",
            "login_pin",
            "is_login_pin_active",
            "is_fingerprint_active",
            "fingerprint",
            "last_login",
            "fcmToken",
            "system_properties",
            "phone_verification_token",
            "email_verification_token",
            "is_email_verified",
            "is_phone_verified",
            "google_id",
            "facebook_id",
            "invitedBy",
            "language_id",
          ],
        },
      },
    ],

    offset,
    limit,
    order: [["id", "DESC"]],
  });
}

function findOrderPaymentHistory(query) {
  let queryArr = [];
  let newObj = {};
  if (query.customer_id) {
    newObj = { customer_id: query.customer_id };
    queryArr.push(newObj);
  }

  if (query.order_id) {
    newObj = { order_id: query.order_id };
    queryArr.push(newObj);
  }
  if (query.amount_type) {
    newObj = { amount_type: query.amount_type };
    queryArr.push(newObj);
  }
  if (query.payment_note) {
    newObj = { payment_note: query.payment_note };
    queryArr.push(newObj);
  }

  return OrderPaymentHistory.findAll({
    where: {
      [Op.and]: queryArr,
    },
    order: [["id", "DESC"]],
  });
}

module.exports = {
  findById,
  findBy,
  findAll,
  create,
  createT,
  update,
  bulkCreate,
  totalCreditAmount,
  totalDebitAmount,

  findAllHistory,
  findOrderPaymentHistory,
};
