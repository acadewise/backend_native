const { Router } = require('express')
const authAdminController = require('../../../modules/auth/authAdminController');
const { loginSchema, sendForgotPasswordSchema, resetPasswordSchema } = require('../../../request-validator/admin/auth_validator');
const router = Router();

router.post('/login', loginSchema, authAdminController.login);
router.post('/password-reset', sendForgotPasswordSchema, authAdminController.sendForgotPasswordLink);
router.post('/password-reset/:adminId/:token', resetPasswordSchema, authAdminController.resetPassword);

module.exports = router