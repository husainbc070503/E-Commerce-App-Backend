const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    image: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/495px-No-Image-Placeholder.svg.png?20200912122019"
    },

    price: {
        type: Number,
        required: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
    },

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
    },

    quantity: {
        type: Number,
        required: true,
    },

    featured: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true,
});

const Products = mongoose.model('product', ProductsSchema);

module.exports = Products;