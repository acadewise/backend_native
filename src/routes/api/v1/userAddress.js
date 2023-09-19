const { Router } = require('express');
const userAddressApiController = require('../../../modules/user_address/userAddressApiController');
const { addUserAddressApiSchema, updateUserAddressSchema, addUserFirstAddressSchema } = require('../../../request-validator/admin/user_validator');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const router = Router();

router.get('/address/user', paginationQuerySchema, userAddressApiController.getAllByUserId);
router.get('/address/:id', idSchema, userAddressApiController.getById);
router.post('/address/', addUserAddressApiSchema, userAddressApiController.create);
router.put('/address/:id', idSchema, updateUserAddressSchema, userAddressApiController.update);
router.delete('/address/:id', idSchema, userAddressApiController.softDelete);
router.post('/createFirstAddress', addUserFirstAddressSchema, userAddressApiController.createFirstAddress);

module.exports = router