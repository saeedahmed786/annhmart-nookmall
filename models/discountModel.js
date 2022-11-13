const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    discountCode: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        required: true
    }

}, { timestamps: true }
);

const discountModal = new mongoose.model('discount', discountSchema);
module.exports = discountModal;
