const { Router } = require('express');
const userUnAvailabilityApiController = require('../../../modules/user_unavailability/userUnAvailabilityApiController');
const { addUserAddressApiSchema, updateUserAddressSchema, addUserFirstAddressSchema } = require('../../../request-validator/admin/user_validator');
const { idSchema, paginationQuerySchema } = require('../../../request-validator/admin/common_validator');
const router = Router();

router.post('/add/',  userUnAvailabilityApiController.create);
 router.delete('/delete/:id', idSchema, userUnAvailabilityApiController.softDelete);
 router.get('/all', paginationQuerySchema, userUnAvailabilityApiController.getAllByUserId);


module.exports = router