const mongoonse = require('mongoose');

const productShema = new mongoonse.Schema({
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    offer: {
        type: String,
    },
    user: {
        type: mongoonse.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    qty: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    tag: {
        type: String,
    },
    productPictures: {
        type: Array
    },
    mainCategory: {
        type: mongoonse.Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategory: {
        type: mongoonse.Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    }
}, { timestamps: true });

const productModel = new mongoonse.model('Product', productShema);
module.exports = productModel;