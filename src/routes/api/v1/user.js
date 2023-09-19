const { Router } = require('express');
const { upload } = require('../../../helper/file_handler');
const userController = require('../../../modules/user/userApiController');
const { createUserSchema } = require('../../../request-validator/api/user_validator');
const router = Router();

router.get('/verify-token', userController.VerifyUserToken);
router.put('/change-language', userController.updateLanguage);
router.get('/user-profile', userController.getUserProfileDetail);
router.put('/update-profile', upload.single('profile_picture'), createUserSchema, userController.updateUserProfile);
router.get('/user-payment-details', userController.checkSinglePaymentHistory);

module.exports = router