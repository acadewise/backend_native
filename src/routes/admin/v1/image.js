const { Router } = require('express');
const { upload } = require('../../../helper/file_handler');
const imgController = require('../../../modules/image/imageAdminController');
const { MAX_IMAGE_UPLOAD } = require('../../../config/configuration_constant');
const { idSchema, imageSchema } = require('../../../request-validator/admin/common_validator');
const router = Router();

router.get('/:id', idSchema, imgController.getImage);
router.post('/uploadSingle', upload.single('image'), imageSchema, imgController.uploadSingleImage);
router.post('/uploadMultiple', upload.array('images', MAX_IMAGE_UPLOAD), imageSchema, imgController.uploadMultipleImages);
router.delete('/:id', idSchema, imgController.deleteImageById);

module.exports = router;