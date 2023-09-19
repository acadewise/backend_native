const Inventory = require("../../models").inventory_master;
const Product = require('../../models').products;
const Supplier = require('../../models').supplier;
const { Op, Sequelize } = require('sequelize');
const { sequelize } = require('../../models');

/**
 * Get Inventory details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return Inventory.findOne({
    where: { id },
  });
}

/**
 * Get Inventory details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return Inventory.findAll(object);
}

/**
 * Find all the Inventory
 */
function findAll(offset, limit) {
  return Inventory.findAll({ offset, limit });
}

/**
 * Create Inventory.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return Inventory.create(data);
}

/**
 * Create Inventory.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function bulkCreate(data) {
  return Inventory.bulkCreate(data);
}

/**
 * Update Inventory.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return Inventory.update(data, { where: { id }, returning: true });
}

/**
 * Soft delete Inventory.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function softDelete(id) {
  return Inventory.destroy({
    where: {
      id,
    },
  });
}

/**
 * 
 * @param {*} attributes 
 * @param {*} offset 
 * @param {*} limit 
 * @returns 
 */
function findAllWithAttributesAndPagination(attributes, offset, limit) {
  return Inventory.findAndCountAll({
    attributes: attributes,
    offset, limit
  })
}


function findAllWithAttributesAndPaginationAndRelationship(query, attributes, offset, limit) {
  let queryArr = [];
  let newObj = {};
  if (query.product_id) {
    newObj = { product_id: query.product_id };
    queryArr.push(newObj);
  }

  if (query.supplier_id) {
    newObj = { supplier_id: query.supplier_id };
    queryArr.push(newObj);
  }

  if (query.from_date || query.to_date) {
    newObj = {
      "effective_date": {
        [Op.between]: [
          query.from_date + "T00:00:00.000Z",
          query.to_date + "T23:59:59.999Z"
        ]
      }
    }
    queryArr.push(newObj);
  }
  if (query.i_type === 'REAL') {

    if (query.inventory_type === "IN") {
      newObj = { inventory_type: "IN" };
      queryArr.push(newObj);
    } else if (query.inventory_type === "OUT") {
      newObj = { inventory_type: "OUT" };
      queryArr.push(newObj);
    } else {
      newObj = {
        inventory_type: {
          [Op.in]: ["IN", "OUT"]
        }
      };
      queryArr.push(newObj);
    }
  } else {
    if (query.i_type === "PREDICTION") {
      newObj = { inventory_type: "PREDICTION" };
      queryArr.push(newObj);
    } else {
      newObj = { inventory_type: query.inventory_type };
      queryArr.push(newObj);
    }
  }

  return Inventory.findAndCountAll({
    attributes: attributes,
    where: {
      [Op.and]: queryArr
    },
    include: [
      {
        model: Supplier,
        as: 'supplier_details',
        required: false,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },

      }
    ],
    offset, limit,
    order: [['id', 'DESC']]

  })
}
/**
 * 
 * @param {*} slug 
 */
function checkUniqueInventorySlug(slug) {
  return Inventory.findOne({
    where: { slug },
    attributes: ['slug']
  });
}

function searchInventoryWithRelation(query, limit, page) {
  let queryArr = [];
  let newObj = {};




  if (query.i_type === "PREDICTION") {
    newObj = { "product_type": 1, is_active: true, }
    queryArr.push(newObj);
  } else {
    newObj = { is_active: true, }
    queryArr.push(newObj);
  }


  return Product.findAndCountAll({
    subQuery: false,
    distinct: true,
    attributes: ['id', 'name', 'sku', 'description', 'product_type'],
    where: queryArr,
    limit, page,
    order: [['id', 'DESC']]



  });




}



/**
 * Get Inventory details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findByProductId(id) {
  return Inventory.findAll({
    where: { product_id: id },
    attributes: ["product_id",
      [Sequelize.literal(`(select sum(stock_quantity) from inventory_masters where inventory_type = 'IN' AND product_id=` + id + `)`), 'total_in'],
      [Sequelize.literal(`(select sum(stock_quantity) from inventory_masters where inventory_type = 'OUT' AND product_id=` + id + `)`), 'total_out'],
      [Sequelize.literal(`(select sum(stock_quantity) from inventory_masters where inventory_type = 'PREDICTION' AND product_id=` + id + `)`), 'total_prediction']
    ],
    group: Sequelize.col("inventory_master.product_id"),
    raw: true
  });


}


function findtotalStcokWithSerachParam(id, query) {

  let queryArr = [];
  let newObj = {};
  let requireStatus = false;
  let queryOperator = "";

  if (query.supplier_id) {
    newObj = { supplier_id: query.supplier_id };
    queryArr.push(newObj);
    requireStatus = true;
    queryOperator += " AND supplier_id=" + query.supplier_id;
  }
  // if (query.inventory_type) {
  //   newObj = { inventory_type: query.inventory_type };
  //   queryArr.push(newObj);
  //   requireStatus = true;
  //   queryOperator += " AND inventory_type=" + query.inventory_type;
  // }

  if (query.from_date || query.to_date) {
    newObj = {
      "effective_date": {
        [Op.between]: [
          query.from_date + "T00:00:00.000Z",
          query.to_date + "T23:59:59.999Z"
        ]
      }
    }
    queryArr.push(newObj);
    requireStatus = true;

    queryOperator += " AND date(effective_date) BETWEEN '" + query.from_date + "' AND '" + query.to_date + "'";
  }


  return Inventory.findAll({
    where: {
      product_id: id
    },
    attributes: ["product_id",
      [Sequelize.literal(`(select sum(stock_quantity) from inventory_masters where inventory_type = 'IN' AND product_id=` + id + queryOperator + `)`), 'total_in'],
      [Sequelize.literal(`(select sum(stock_quantity) from inventory_masters where inventory_type = 'OUT' AND product_id=` + id + queryOperator + `)`), 'total_out'],
      [Sequelize.literal(`(select sum(stock_quantity) from inventory_masters where inventory_type = 'PREDICTION' AND product_id=` + id + queryOperator + `)`), 'total_prediction']
    ],
    group: Sequelize.col("inventory_master.product_id"),
    raw: true
  });


}

function findProductQuantityPrediction(id, effective_date) {
  return Inventory.findAll({
    where: {
      product_id: id,
      effective_date: {
        [Op.eq]: effective_date + "T00:00:00.000Z"
      }
    },
    attributes: ["product_id",
      [Sequelize.literal(`(select sum(stock_quantity) from inventory_masters where inventory_type = 'PREDICTION' AND product_id=` + id + ` AND date(effective_date)=` + effective_date + `)`), 'total_prediction'],
      [Sequelize.literal(`(select sum(stock_quantity) from inventory_masters where inventory_type = 'CUSTOMER_PREDICTION' AND product_id=` + id + ` AND date(effective_date)=` + effective_date + `)` `)`), 'total_customer_prediction']
    ],
    group: Sequelize.col("inventory_master.product_id"),
    raw: true
  });


}

function getProductQuantity(query, limit, page) {
  let queryArr = [];
  let newObj = {};
  let requireStatus = false;
  if (query.product_id) {
    newObj = { product_id: query.product_id };
    queryArr.push(newObj);
    requireStatus = true;
  }

  if (query.inventory_type) {
    newObj = { inventory_type: query.inventory_type };
    queryArr.push(newObj);
    requireStatus = true;
  }

  if (query.effective_date) {

    newObj = {
      "effective_date": {
        [Op.eq]: query.effective_date + "T00:00:00.000Z"
      }
    }
    queryArr.push(newObj);
    requireStatus = true;
  }

  return Inventory.findOne({
    subQuery: false,
    distinct: true,
    attributes: ['id', "stock_quantity", "effective_date", "customer_total_order_prediction"],

    where: queryArr,
    limit, page,


  });

}

const setProductQuantity = (param, t) => {

  let itemQuantity = parseFloat(param.quantity);

  let data = sequelize.query(
    "UPDATE inventory_masters set customer_total_order_prediction = COALESCE(customer_total_order_prediction,0)+" + itemQuantity + " where product_id=" + param.product_id + " AND date(effective_date)='" + param.effective_date + "' AND inventory_type='" + param.inventory_type + "'",
    {
      type: sequelize.QueryTypes.UPDATE,

    },
    {
      transaction: t
    }

  );
  return data;
}

module.exports = {
  findById,
  findBy,
  findAll,
  create,
  update,
  softDelete,
  findAllWithAttributesAndPagination,
  checkUniqueInventorySlug,
  findAllWithAttributesAndPaginationAndRelationship,
  searchInventoryWithRelation,
  findByProductId,
  bulkCreate,
  getProductQuantity,
  findProductQuantityPrediction,
  findtotalStcokWithSerachParam,
  setProductQuantity
};
