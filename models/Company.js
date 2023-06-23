const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    isProductsAvalaible: {
        type: Boolean,
        default: true
    }
    
}, {
    timestamps: true
});

const Company = mongoose.model('company', CompanySchema);

module.exports = Company;