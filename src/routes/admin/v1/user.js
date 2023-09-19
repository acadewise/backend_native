const { Router } = require('express');
const { Activity_Logs } = require('../../../constants/admin');
const createActivityLogs = require('../../../middlewares/activity_log')
const userAdminController = require('../../../modules/user/userAdminController');
const userAddressController = require('../../../modules/user_address/userAddressAdminController');
const { updateAdminSchema, activeInactiveAdminSchema } = require('../../../request-validator/admin/admin_validator');
const { addUserAddressSchema, updateUserAddressSchema, createUserSchema } = require('../../../request-validator/admin/user_validator');
const { idSchema, uuIdSchema, uuIdQuerySchema, searchSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const router = Router();

router.get('/users', paginationQuerySchema, userAdminController.getAllUsers);
router.post('/user', createUserSchema, userAdminController.createUser);
router.get('/:id', uuIdSchema, userAdminController.getUserById);
router.put('/:id', uuIdSchema, updateAdminSchema, userAdminController.updateUser);
router.get('/profile/:id/:status', activeInactiveAdminSchema, createActivityLogs(Activity_Logs.USER, Activity_Logs.USER_CHANGE_STATUS), userAdminController.activeInactiveUser);
router.get('/search/user', searchSchema, paginationQuerySchema, userAdminController.searchUser);

// User address
router.get('/address/user', uuIdQuerySchema, paginationQuerySchema, userAddressController.getAllByUserId);
router.get('/address/:id', idSchema, userAddressController.getById);
router.post('/address/', addUserAddressSchema, createActivityLogs(Activity_Logs.USER_ADDRESS, Activity_Logs.USER_ADDRESS_CREATE), userAddressController.create);
router.put('/address/:id', idSchema, updateUserAddressSchema, createActivityLogs(Activity_Logs.USER_ADDRESS, Activity_Logs.USER_ADDRESS_UPDATE), userAddressController.update);
router.delete('/address/:id', idSchema, createActivityLogs(Activity_Logs.USER_ADDRESS, Activity_Logs.USER_ADDRESS_DELETE), userAddressController.softDelete);

module.exports = router