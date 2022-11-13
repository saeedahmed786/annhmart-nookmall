const express = require('express');
const { AuthenticatorJWT, isAdmin } = require('../middlewares/authenticator');
const { getAllCategories, getAllSubCategories, getAllMainCategories, createMainCategory, createSubCategory, getCategoryById, updateCategory, deleteCategory, getAllSubCategoriesById, getAllSimpleCategories } = require('../controllers/categoryController');
const upload = require('../middlewares/multer');

const router = express.Router();

router.get('/get', getAllCategories);
router.get('/all-simple', getAllSimpleCategories);
router.get('/get/sub-categories', getAllSubCategories);
router.get('/all/sub/:id', getAllSubCategoriesById);
router.get('/main/get', getAllMainCategories);
router.post('/main/create', upload.single('file'), AuthenticatorJWT, isAdmin, createMainCategory);
router.post('/sub/create', upload.single('file'), AuthenticatorJWT, isAdmin, createSubCategory);
router.post('/edit/:id', getCategoryById);
router.put('/update/:id', upload.single('file'), AuthenticatorJWT, isAdmin, updateCategory);
router.delete('/delete/:id', AuthenticatorJWT, isAdmin, deleteCategory);


module.exports = router;