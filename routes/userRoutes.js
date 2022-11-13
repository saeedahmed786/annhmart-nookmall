const express = require('express');
const upload = require('../middlewares/multer');
const { AuthenticatorJWT, isAdmin } = require('../middlewares/authenticator');
const { getAllUsers, getUserById, adminLogin, changePassword, resetPasswordLink, updatePassword, SignUp, Login, updateUsername, addUserByAdmin, updateUserByAdmin, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.get('/get', AuthenticatorJWT, getAllUsers);
router.get('/get/:id', getUserById);
router.post('/signup', upload.single('file'), SignUp);
router.post('/admin/add-user', addUserByAdmin);
router.post('/login', Login);
router.post('/admin/login', adminLogin);
router.put('/admin/update/:id', AuthenticatorJWT, updateUserByAdmin);
router.put('/update/username', AuthenticatorJWT, updateUsername);
router.post('/change/password', AuthenticatorJWT, changePassword);

router.post('/send/forgot-email', resetPasswordLink);
router.post('/update/password', updatePassword);

router.delete('/delete/:id', AuthenticatorJWT, isAdmin, deleteUser);

module.exports = router;