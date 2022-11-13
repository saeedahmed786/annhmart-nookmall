const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: {
        type: Number,
        default: '0'
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String
    },
    expireToken: {
        type: String
    },
    points: {
        type: String,
        default: "0"
    },
    verification: {
        type: Boolean,
        default: false
    },
    orders: {
        type: Array
    },
    DudoCode: {
        type: String,
        default: "0"
    },
    star: {
        type: String
    },
    status: {
        type: String,
        default: 'active'
    },

}, { timestamps: true }
);

const userModel = new mongoose.model('User', userSchema);
module.exports = userModel;
