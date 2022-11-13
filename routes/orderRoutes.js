const express = require('express');
const { isAdmin, AuthenticatorJWT } = require('../middlewares/authenticator');
const { getAllOrdersByUserId, deleteOrder, getAllOrders, placeOrderCOD, placeOrderPaypal, setOrderStatus, getAllOrderById, getAllCustomerOrdersById, getAllCompletedOrders, getAllVendorCompletedOrders, orderNotes, grabOrder, returnOrder } = require('../controllers/orderController');

const router = express.Router();

router.post('/place-order', AuthenticatorJWT, placeOrderPaypal);
router.get('/:id', AuthenticatorJWT, getAllOrdersByUserId);
router.get('/get/order/:id', AuthenticatorJWT, getAllOrderById);
router.post('/set/status', AuthenticatorJWT, isAdmin, setOrderStatus);
// router.get('/all-orders', AuthenticatorJWT, getAllOrders);
router.get('/completed-orders', AuthenticatorJWT, getAllCompletedOrders);
router.get('/completed-orders/vendor/:id', AuthenticatorJWT, getAllVendorCompletedOrders);
router.get('/admin/all-orders', AuthenticatorJWT, getAllOrders);
router.post('/customer/orders/:id', AuthenticatorJWT, getAllCustomerOrdersById);
router.delete('/order/delete/:id', AuthenticatorJWT, deleteOrder);

router.post('/add/note/:id', AuthenticatorJWT, orderNotes);
router.get('/grab/:id', AuthenticatorJWT, grabOrder);
router.get('/return/:id', AuthenticatorJWT, returnOrder);


module.exports = router;