const { Router } = require('express');
const userUnAvailabilityAdminController = require('../../../modules/user_unavailability/userUnAvailabilityAdminController');
const { addUserAddressApiSchema, updateUserAddressSchema, addUserFirstAddressSchema } = require('../../../request-validator/admin/user_validator');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const router = Router();


router.get('/all', paginationQuerySchema, userUnAvailabilityAdminController.getAllByUserId);


module.exports = router