const express = require('express');
const { uploadFiles, deleteFile } = require('../controllers/uploadFilesController');
const { AuthenticatorJWT } = require('../middlewares/authenticator');
const upload = require('../middlewares/multer');

const router = express.Router();

router.post('/post', upload.single("file"), AuthenticatorJWT, uploadFiles);
router.post('/delete', AuthenticatorJWT, deleteFile);


module.exports = router;