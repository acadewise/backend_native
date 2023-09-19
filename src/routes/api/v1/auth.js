const { Router } = require('express');
const authController = require('../../../modules/auth/authApiController');
const { authenticateSchema } = require('../../../request-validator/api/auth_validator');
const router = Router();

router.post('/authenticate', authenticateSchema, authController.authentication);
router.post('/otp-verification', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.get('/app-version-check', authController.checkLatestAppVersion);

module.exports = router