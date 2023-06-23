const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        }
    ],

    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },

    userQuantity: {
        type: Array,
        default: []
    },

    isDelivered: {
        type: Boolean,
        default: false
    },
    
}, { timestamps: true });

const Order = mongoose.model('order', OrderSchema);

module.exports = Order;