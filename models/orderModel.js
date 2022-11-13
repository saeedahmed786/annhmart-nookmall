const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: Object,
        default: {}
    },
    userId: {
        type: String,
    },
    data: {
        type: Object,
        default: {}
    },
    products: {
        type: Array,
    },
    status: {
        type: String,
        default: "1"
    },
    tipAmount: {
        type: String,
        default: ''
    },
    discount: {
        type: String,
        default: ''
    },
    subTotal: {
        type: String,
        default: ''
    },
    totalPrice: {
        type: String,
        default: ''
    },
    placed: {
        type: String,
        default: ''
    },
    statusUpdateTime: {
        type: String,
        default: "---"
    },
    grabbed: {
        type: mongoose.Schema.Types.ObjectId
    },
    returned: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    notes: {
        type: Array,
        default: []
    }
}, { timestamps: true }
);

const orderModel = new mongoose.model('Order', orderSchema);
module.exports = orderModel;
