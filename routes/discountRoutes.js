const express = require('express');
const { getAllDiscountCodes, getDiscountCodeById, addDiscountCode, updateDiscountCode, deleteDiscount, checkDisountCode, addCustomerDiscountCode, getCustomerDiscountCode } = require('../controllers/discountController');
const { AuthenticatorJWT, isAdmin } = require('../middlewares/authenticator');

const router = express.Router();

router.get('/', AuthenticatorJWT, isAdmin, getAllDiscountCodes);
router.get('/user/code', AuthenticatorJWT, getCustomerDiscountCode);
router.post('/user', AuthenticatorJWT, addCustomerDiscountCode);
router.get('/get/:id', AuthenticatorJWT, isAdmin, getDiscountCodeById);
router.post('/check', AuthenticatorJWT, checkDisountCode);
router.post('/add', AuthenticatorJWT, isAdmin, addDiscountCode);
router.put('/update/:id', AuthenticatorJWT, isAdmin, updateDiscountCode);
router.delete('/delete/:id', AuthenticatorJWT, isAdmin, deleteDiscount);


module.exports = router;