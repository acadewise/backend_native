const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const activityLogs = require('../../../middlewares/activity_log');
const supplierAdminController = require('../../../modules/supplier/supplierAdminController');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const { createSupplierSchema, updateSupplierSchema } = require('../../../request-validator/admin/supplier_validator');
const router = Router();

router.post('/add', createSupplierSchema, activityLogs(Activity_Logs.SUPPLIER, Activity_Logs.SUPPLIER_CREATE), supplierAdminController.createSupplier);
router.get('/suppliers', paginationQuerySchema, supplierAdminController.getAllSuppliers);
router.get('/:id', idSchema, supplierAdminController.getSupplierById);
router.put('/:id', idSchema, updateSupplierSchema, activityLogs(Activity_Logs.SUPPLIER, Activity_Logs.SUPPLIER_UPDATE), supplierAdminController.updateSupplier);
router.delete('/:id', idSchema, activityLogs(Activity_Logs.SUPPLIER, Activity_Logs.SUPPLIER_DELETE), supplierAdminController.deleteSupplier);


module.exports = router