const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },

    review: {
        type: String,
        trim: true,
    },

    rating: {
        type: Number,
        default: 0
    },

    isRecommended: {
        type: Boolean,
        default: true
    }
    
}, { timestamps: true });

const Review = mongoose.model('review', ReviewSchema);

module.exports = Review;