const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true
    },

    address: {
        type: String,
        trim: true,
    },

    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/16/16363.png?w=740&t=st=1685556919~exp=1685557519~hmac=dd01fffcf3b26b1653b5fdebbd2b23db6262e05fd28b9f21b247d87bf118c3b5"
    },

    role: {
        type: String,
        default: "User"
    },

    phone: {
        type: Number,
    }

}, {
    timestamps: true
});

const User = mongoose.model('user', UserSchema);

module.exports = User