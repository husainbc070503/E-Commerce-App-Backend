const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },

    otp: {
        type: Number,
        required: true,
        default: 0
    },

    expiresIn: {
        type: Number,
        default: 0
    },

    requestedOn: {
        type: mongoose.Schema.Types.Date,
        default: new Date().getTime()
    }
}, { timestamps: true })

const Token = mongoose.model('token', TokenSchema);

module.exports = Token