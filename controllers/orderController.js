const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Template = require('../email-template');
const sendEmail = require('../nodemailer');

exports.getAllOrders = async (req, res) => {
    const orders = await Order.find();
    if (orders) {
        res.status(200).json(orders);
    } else {
        res.status(404).json({ errorMessage: 'No orders Found' });
    }
}

exports.getAllCompletedOrders = async (req, res) => {
    const orders = await Order.find({ status: '5' });
    if (orders) {
        res.status(200).json(orders);
    } else {
        res.status(404).json({ errorMessage: 'No orders Found' });
    }
}

exports.getAllVendorCompletedOrders = async (req, res) => {
    const orders = await Order.find({ vendorId: req.params.id, status: '5' });
    if (orders) {
        res.status(200).json(orders);
    } else {
        res.status(404).json({ errorMessage: 'No orders Found' });
    }
}


exports.getAllOrdersByUserId = async (req, res) => {
    const orders = await Order.find({ userId: req.params.id });
    if (orders) {
        res.status(200).json(orders);
    } else {
        res.status(404).json({ errorMessage: 'No orders Found' });
    }
}

exports.getAllCustomerOrdersById = async (req, res) => {
    const orders = await Order.find({ userId: req.params.id, vendorId: req.body.vendorId });
    if (orders) {
        res.status(200).json(orders);
    } else {
        res.status(404).json({ errorMessage: 'No orders Found' });
    }
}

exports.getAllOrderById = async (req, res) => {
    const orders = await Order.findOne({ _id: req.params.id });
    if (orders) {
        res.status(200).json(orders);
    } else {
        res.status(404).json({ errorMessage: 'No orders Found' });
    }
}

exports.orderNotes = async (req, res) => {
    Order.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { notes: { note: req.body.note, userId: req.user._id } } },
        function (error, success) {
            if (error) {
                res.status(404).json({ errorMessage: 'No orders Found' });
            } else {
                res.status(200).json({ successMessage: 'Note added!', success });
            }
        });
}

exports.grabOrder = async (req, res) => {
    console.log(req.user)
    const order = await Order.findOne({ _id: req.params.id });
    if (order) {
        order.grabbed = req.user._id;
        order.status = "2";
        const saveOrder = order.save();
        if (saveOrder) {
            res.status(200).json({ successMessage: 'Order grabbed!' });
        }
        else {
            res.status(404).json({ errorMessage: 'No order Found' });
        }
    } else {
        res.status(404).json({ errorMessage: 'No order Found' });
    }
}

exports.returnOrder = async (req, res) => {
    Order.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { returned: req.user._id } },
        function (error, success) {
            if (error) {
                res.status(404).json({ errorMessage: 'No orders Found' });
            } else {
                res.status(200).json({ successMessage: 'Order returned!' });
            }
        });
}

exports.placeOrderCOD = async (req, res) => {
    console.log('order');
    await req.body.cartProducts.forEach(async (item) => {
        const order = new Order({
            userId: req.user._id,
            product: {
                name: item.title,
                image: item.image,
                productId: item.productId,
                price: item.price,
                qty: item.qty
            },
            user: {
                name: req.body.name,
                email: req.body.email
            },
            placed: req.body.placed,

        });
        await order.save(async (err, result) => {
            if (err) { console.log('Payment Failed') }
            if (result) {
                const findProduct = await Product.findOne({ _id: item.productId });
                if (findProduct) {
                    findProduct.qty = findProduct.qty - item.qty;
                    findProduct.save((error, data) => {
                        if (error) {
                            console.log(error)
                        } else {
                            sendEmail(req.body.email, "Your order is placed!", Template({ orderId: result._id, name: req.body.name }))
                            User.findOne({ _id: req.user._id }).then(user => {
                                if (!user) { res.status(404).json({ errorMessage: 'Email does not exist' }); }
                                if (user) {
                                    user.points = parseInt(req.body.totalPrice) + parseInt(user.points) * 2;
                                    user.save();
                                }
                            });
                        }
                    })
                }
            } else {
                console.log('error');
            }
        })
    })
    res.status(200).json({ successMessage: 'Successfully Purchased Items!' });
}

exports.placeOrderPaypal = async (req, res) => {
    const order = new Order({
        userId: req.user._id,
        products: req.body.cartProducts,
        user: {
            name: req.body.name,
            email: req.body.email
        },
        data: req.body.paymentData,
        tipAmount: req.body.tipAmount,
        discount: req.body.discount,
        subTotal: req.body.subTotal,
        totalPrice: req.body.totalPrice,
        placed: req.body.placed,
    });
    await order.save(async (err, result) => {
        if (err) { console.log('Payment Failed') }
        if (result) {
            sendEmail(req.body.email, "Your order is placed!", Template({ orderId: result._id, name: req.body.name }));
            User.findOne({ _id: req.user._id }).then(user => {
                if (!user) { res.status(404).json({ errorMessage: 'Email does not exist' }); }
                if (user) {
                    user.points = parseInt(req.body.totalPrice) + parseInt(user.points) * 2;
                    user.save();
                    res.status(200).json({ successMessage: 'Successfully Purchased Items!' });
                }
            });
        } else {
            console.log('error');
        }
    })
}

// exports.placeOrderPaypal = async (req, res) => {
//     await req.body.cartProducts.forEach(async (item) => {
//         const order = new Order({
//             userId: req.user._id,
//             product: {
//                 name: item.title,
//                 image: item.image,
//                 productId: item.productId,
//                 price: item.price,
//                 qty: item.qty,
//                 paymentId: req.body.paymentData.paymentID
//             },
//             user: {
//                 name: req.body.name,
//                 email: req.body.email
//             },
//             deliveryData: req.body.deliveryData,
//             data: req.body.paymentData,
//             placed: req.body.placed,
//         });
//         await order.save(async (err, result) => {
//             if (err) { console.log('Payment Failed') }
//             if (result) {
//                 const findProduct = await Product.findOne({ _id: item.productId });
//                 if (findProduct) {
//                     findProduct.qty = findProduct.qty - item.qty;
//                     findProduct.save((error, data) => {
//                         if (error) {
//                             console.log(error)
//                         }
//                         else {
//                             sendEmail(req.body.email, "Your order is placed!", Template({ orderId: result._id, name: req.body.name }))
//                             User.findOne({ _id: req.user._id }).then(user => {
//                                 if (!user) { res.status(404).json({ errorMessage: 'Email does not exist' }); }
//                                 if (user) {
//                                     user.points = parseInt(req.body.totalPrice) + parseInt(user.points) * 2;
//                                     user.save();
//                                 }
//                             });
//                         }
//                     });
//                 }
//             } else {
//                 console.log('error');
//             }
//         })
//     })
//     res.status(200).json({ successMessage: 'Successfully Purchased Items!' });
// }

exports.paymentController = async (req, res) => {
    const { token } = req.body;
    stripe.charges.create({
        description: 'Buying Acnmart Product',
        source: token.id,
        currency: 'USD',
        amount: parseInt(10 * 100),
        receipt_email: token.email
    })
        .then(result => {
            User.findOne({ _id: req.user._id }).exec((error, user) => {
                if (error) {
                    res.status.json({ errorMessage: 'User not found' });
                }
                if (user) {
                    user.save();
                    res.status(200).json({ successMessage: 'Paid Successfully!', result });
                }
            })
        }).catch(err => {
            console.log(err);
            res.status(400).json({ errorMessage: 'Payment failed. Try again!', err });
        });
}


exports.placeOrderStripe = async (req, res) => {
    await req.body.cartProducts.forEach(async (item) => {
        const order = new Order({
            userId: req.user._id,
            product: {
                name: item.title,
                image: item.image,
                productId: item.productId,
                price: item.price,
                qty: item.qty,
                paymentId: req.body.paymentData.paymentID
            },
            user: {
                name: req.body.name,
                email: req.body.email
            },
            deliveryData: req.body.deliveryData,
            data: req.body.paymentData,
            placed: req.body.placed,
        });
        await order.save(async (err, result) => {
            if (err) { console.log('Payment Failed') }
            if (result) {
                const findProduct = await Product.findOne({ _id: item.productId });
                if (findProduct) {
                    findProduct.qty = findProduct.qty - item.qty;
                    findProduct.save((error, data) => {
                        if (error) {
                            console.log(error)
                        } else {
                            sendEmail(req.body.email, "Your order is placed!", Template({ orderId: result._id, name: req.body.name }))
                            User.findOne({ _id: req.user._id }).then(user => {
                                if (!user) { res.status(404).json({ errorMessage: 'Email does not exist' }); }
                                if (user) {
                                    user.points = parseInt(req.body.totalPrice) + parseInt(user.points) * 2;
                                    user.save();
                                }
                            });
                        }
                    })
                }
            } else {
                console.log('error');
            }
        })
    })
    res.status(200).json({ successMessage: 'Successfully Purchased Items!' });
}


exports.setOrderStatus = async (req, res) => {
    let getStatus = req.body.status == '2' ?
        `Confirmed`
        :
        req.body.status == '3' ?
            `Prepared`
            :
            req.body.status == '4' ?
                `Out for delivery`
                :
                req.body.status == '5' ?
                    `Complete`
                    :
                    null;
    const order = await Order.findOne({ _id: req.body.orderId });
    if (order) {
        order.status = req.body.status
        order.statusUpdateTime = req.body.updateTime
        order.save(async (error, result) => {
            if (error) res.status(400).json({ errorMessage: 'Status update failed!' });
            if (result) {
                await sendEmail(result.user.email, "You've got order updates!", Template({ orderId: result._id, name: result.user.name, orderStatus: getStatus }))
                res.status(200).json({ successMessage: 'Order status updated successfully!' });
            }
        })
    } else {
        res.status(404).json({ errorMessage: 'No order found!' });
    }
}

exports.deleteOrder = async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id }).exec();
    if (order) {
        order.status = "0";
        order.save(async (err, result) => {
            if (result) {
                await sendEmail(result.user.email, "Your is cancelled", Template({ orderId: result._id, name: result.user.name, orderStatus: getStatus }))
                res.status(200).json({ successMessage: 'Order Cancelled Successfully' });
            } else {
                console.log('Failed order cancellation');
            }
        })
    } else {
        res.status(404).json({ errorMessage: 'No order found!' });
    }
}


