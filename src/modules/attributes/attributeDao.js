const Attribute = require("../../models").attributes;
const AttributeValue = require("../../models").attribute_values;
const Category = require("../../models").categories;
const atribCat = require("../../models").attribute_categories;
/**
 * Get Attribute details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
function findById(id) {
  return Attribute.findOne({
    where: { id }
  });
}

/**
 * Get Attribute details by id
 *
 * @param {Number} id
 * @returns {Promise}
 */
 function findByIdWithValues(id) {
  return Attribute.findOne({
    where: { id },
    include: [
      {
        model: AttributeValue,
        required: false,
        as: 'attribute_values',
        where: { 
          is_active: true
        }
      },{
        model: Category,
        required: false,
        as: 'attrib_categories',
        through: {
          where : { 
            is_active: true
          }
        }
      }
    ]
  });
}

/**
 * Get Attribute details.
 *
 * @param {Object} object
 * @returns {Promise}
 */
function findBy(object) {
  return Attribute.findAll(object);
}

/**
 * Find all the Attributes
 */
function findAll(offset, limit) {
  return Attribute.findAndCountAll({ 
    offset, limit,
  });
}

/**
 * Find all the Attributes
 */
 function findAllWithValues(offset, limit) {
  return Attribute.findAndCountAll({ 
    offset, limit,
    distinct: true,
    include: [
      {
        model: AttributeValue,
        required: false,
        as: 'attribute_values',
        where: { 
          is_active: true
        }
      },{
        model: Category,
        required: false,
        as: 'attrib_categories',
        through: {
          where : { 
            is_active: true
          }
        }
      }
    ],
    order:[['id','DESC']]
  });
}

/**
 * Create Attribute.
 *
 * @param {Object} data
 * @returns {Promise}
 */
function create(data) {
  return Attribute.create(data);
}

/**
 * Update Attribute.
 *
 * @param {Number} id
 * @param {Object} data
 * @returns {Promise}
 */
function update(id, data) {
  return Attribute.update(data, { where: { id }, returning: true });
}

/**
 * Soft delete Attribute.
 *
 * @param {Number} id
 * @returns {Promise}
 */
function softDelete(id) {
  return Attribute.destroy({
    where: {
      id,
    },
  });
}

module.exports = {
  findById,
  findByIdWithValues,
  findBy,
  findAll,
  findAllWithValues,
  create,
  update,
  softDelete,
};
