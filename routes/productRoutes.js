const express = require('express');
const upload = require('../middlewares/multer');
const { isAdmin, AuthenticatorJWT } = require('../middlewares/authenticator');
const { getAllProducts, getProductById, updateProduct, deleteProduct, getRelatedProducts, uploadProduct, getAllNewArrivalProducts, getAllAdminProducts, getLimitedProducts, getLimitedProductByCategory, getLimitedProductsByCat } = require('../controllers/productController');

const router = express.Router();

router.get('/get/:page', getLimitedProducts);
router.get('/get/new-arrivals', getAllNewArrivalProducts);
router.get('/admin/get/:id', getAllAdminProducts);
router.get('/product/:id', getProductById);
router.post('/cat/:id', getLimitedProductsByCat);
router.post('/create', AuthenticatorJWT, isAdmin, uploadProduct);
router.post('/update/:id', upload.any('file'), AuthenticatorJWT, isAdmin, updateProduct);
router.get('/get/related/:id', getRelatedProducts);
router.delete('/delete/:id', AuthenticatorJWT, isAdmin, deleteProduct);

module.exports = router;