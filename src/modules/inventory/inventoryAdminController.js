const inventoryDao = require("./inventoryDao");
const responseHelper = require('../../helper/response_utility');
const supplierDao = require('../../modules/supplier/supplierDao');
const { getPageAndLimit, getDateRange } = require('../../helper/helper_function');
const productDao = require('../../modules/product/product/productDao');
const moment = require('moment');

/**
 * Create inventory.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const createInventory = async (req, res) => {
    try {
        const { product_type, product_id, supplier_id, stock_quantity, inventory_type, bill_reference_no, remarks, reason, effective_date, quantity_type } = req.body;
        const product = await productDao.findById(product_id);
        if (!product) {
            return responseHelper.notFoundResponse(req, res, 'Product not found');
        }
        const supplier = await supplierDao.findById(supplier_id);
        if (!supplier && inventory_type !== "PREDICTION") {
            return responseHelper.notFoundResponse(req, res, 'Supplier not found');
        }



        if (parseInt(product_type) === 1 && (inventory_type === "IN" || inventory_type === "PREDICTION")) {  /// Variable Product

            const { from_date, to_date } = req.body;
            var startDate = moment(from_date);
            var endDate = moment(to_date);

            var now = startDate.clone(), inventoryDataArr = [];
            while (now.isSameOrBefore(endDate)) {
                let serachParam = {
                    product_id,
                    effective_date: now.format('YYYY-MM-DD'),
                    inventory_type
                }
                let checkAlreadyExits = await inventoryDao.getProductQuantity(serachParam);
                //console.log("checkAlreadyExits===>", checkAlreadyExits)

                if (!checkAlreadyExits) {
                    let inventoryData = {
                        product_id,
                        supplier_id,
                        stock_quantity,
                        inventory_type,
                        bill_reference_no,
                        remarks,
                        reason,
                        effective_date: now.format('YYYY-MM-DD')
                    };
                    inventoryDataArr.push(inventoryData);
                } else {
                    // DEFAULT, INCREASE, DECREASE
                    let totalStock = checkAlreadyExits && checkAlreadyExits.dataValues && checkAlreadyExits.dataValues.stock_quantity;
                    let customerPrediction = checkAlreadyExits && checkAlreadyExits.dataValues && checkAlreadyExits.dataValues.customer_total_order_prediction || 0;

                    if (quantity_type.toUpperCase() === "INCREASE" && inventory_type === "PREDICTION") {
                        let final_stock_quantity = parseFloat(totalStock) + parseFloat(stock_quantity);
                        let obj = {
                            stock_quantity: final_stock_quantity
                        }
                        const res = await inventoryDao.update(checkAlreadyExits.dataValues.id, obj);
                    } else if (quantity_type.toUpperCase() === "DECREASE" && inventory_type === "PREDICTION") {
                        let final_stock_quantity = parseFloat(totalStock) - parseFloat(stock_quantity);
                        if (parseFloat(final_stock_quantity) >= parseFloat(customerPrediction)) {
                            let obj = {
                                stock_quantity: final_stock_quantity
                            }
                            const res = await inventoryDao.update(checkAlreadyExits.dataValues.id, obj);
                        }
                    } 


                }

                now.add(1, 'days');
            }
            if (inventoryDataArr.length > 0) {
                const inventoryRes = await inventoryDao.bulkCreate(inventoryDataArr);
                return responseHelper.successResponse(req, res, inventoryRes, "Inventory successfully created");
            } else {
                // return responseHelper.notFoundResponse(req, res, 'Inventory already exists for followling dates ' + from_date + " ," + to_date);
                return responseHelper.successResponse(req, res, "Inventory successfully updated");
            }


        } else if (inventory_type === "OUT" || inventory_type === "IN") {  // Fixed Product And For OUT Type Of Inventory

            const inventoryData = {
                product_id,
                supplier_id,
                stock_quantity,
                inventory_type,
                bill_reference_no,
                remarks,
                reason,
                effective_date,
            };
            const inventoryRes = await inventoryDao.create(inventoryData);
            return responseHelper.successResponse(req, res, inventoryRes, "Inventory successfully created");
        } else {
            return responseHelper.notFoundResponse(req, res, 'Not Valid Inventory type');
        }



    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Get All inventory list.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllInventory = async (req, res) => {
    try {
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const attributes = ["id", "product_id", "supplier_id", "stock_quantity", "inventory_type", "bill_reference_no", "remarks", "reason", "effective_date", "customer_total_order_prediction"]
        const inventoryList = await inventoryDao.findAllWithAttributesAndPaginationAndRelationship(req.query, attributes, page, limit)
        const resData = {
            data: inventoryList.rows,
            count: inventoryList.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((inventoryList.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, "inventory records successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

const searchInventory = async (req, res) => {
    try {
        let query = req.query;
        const { _page: originalPageValue, page, limit } = getPageAndLimit(req);
        const result = await inventoryDao.searchInventoryWithRelation(query, limit, page);
        if (!result) {
            return responseHelper.notFoundResponse(req, res, 'No product found!');
        }

        let newInventoryTotal = [];
        if (result && result.rows && result.rows.length > 0) {

            let newObj = result.rows.map(async (XItem, xIndex) => {

                let getTotal = await inventoryDao.findtotalStcokWithSerachParam(XItem.id, query);
                XItem.setDataValue("inventory_details", getTotal);
                return XItem;
            })
            const results = await Promise.all(newObj)

        }

        const resData = {
            data: result.rows,
            count: result.count,
            page: originalPageValue,
            per_page: limit,
            total_pages: Math.ceil((result.count / limit))
        }
        return responseHelper.successResponseWithCount(req, res, resData, 'Inventorys are successfully fetched.');
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Get inventory details by with product Id.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getInventoryByProductId = async (req, res) => {
    try {
        const { id } = req.params;
        const inventoryData = await inventoryDao.findByProductId(id);
        // if (!inventoryData) {
        //     return responseHelper.notFoundResponse(req, res, "inventory Data not found!");
        // }
        const product = await productDao.findById(id);
        product.setDataValue("inventory_total", inventoryData);
        // if (inventoryData && inventoryData.length > 0) {
        //     // const product = await productDao.findById(id);
        //     // product.setDataValue("inventory_total", inventoryData);
        //     return responseHelper.successResponse(req, res, product, "inventory data successfully fetched");
        // }
        return responseHelper.successResponse(req, res, product, "inventory data successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}


/**
 * Get inventory details by Id.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getInventoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const inventoryData = await inventoryDao.findById(id);
        if (!inventoryData) {
            return responseHelper.notFoundResponse(req, res, "inventory Data not found!");
        }
        return responseHelper.successResponse(req, res, inventoryData, "inventory data successfully fetched");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
}

/**
 * Update inventory details.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateInventory = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = req.body;
        delete updates.id;
        const inventoryData = await inventoryDao.findById(id);
        if (!inventoryData) {
            return responseHelper.notFoundResponse(req, res, "inventory Data not found!");
        }
        // if (updates.inventory_type === "IN") {  
        let formData = {};
        formData.updated_by = req.adminData.id;
        formData.stock_quantity = req.body.stock_quantity;
        const [count, inventoryNewData] = await inventoryDao.update(inventoryData.id, formData);
        return responseHelper.successResponse(req, res, inventoryNewData, "inventory record successfully updated");
        // }
        // let noReciord   =   [];
        // return responseHelper.successResponse(req, res, noReciord, "inventory record successfully updated");

    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

/**
 * Soft Delete inventory.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const deleteInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const inventoryData = await inventoryDao.findById(id);
        if (!inventoryData) {
            return responseHelper.notFoundResponse(req, res, "inventory Data not found!");
        }
        const inventoryRes = await inventoryDao.softDelete(inventoryData.id);
        return responseHelper.successResponse(req, res, inventoryRes, "inventory successfully deleted");
    } catch (error) {
        return responseHelper.internalServerError(req, res, error);
    }
};

module.exports = {
    createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory,
    searchInventory,
    getInventoryByProductId
};
