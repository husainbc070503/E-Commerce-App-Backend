const Company = require('../models/Company');
const router = require('express').Router();

router.get('/getAllCompanies', async (req, res) => {
    try {
        const comps = await Company.find();
        res.status(200).json(comps);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.post('/addCompany', async (req, res) => {
    const { name, isProductsAvalaible } = req.body;
    try {
        const comp = await Company.create({ name, isProductsAvalaible });
        res.status(200).json({ success: true, comp });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/updateCompany/:id', async (req, res) => {
    const { name, isProductsAvalaible } = req.body;
    try {
        const comp = await Company.findByIdAndUpdate(req.params.id, { name, isProductsAvalaible }, { new: true });
        res.status(200).json({ success: true, comp });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});


router.delete('/deleteCompany/:id', async (req, res) => {
    try {
        const comp = await Company.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, comp });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router