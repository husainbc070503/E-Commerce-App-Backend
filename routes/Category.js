const Category = require('../models/Category');
const router = require('express').Router();

router.get('/getAllCategories', async (req, res) => {
    try {
        const cats = await Category.find();
        res.status(200).json(cats)
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.post('/addCategory', async (req, res) => {
    const { name, isActive } = req.body;
    try {
        const cat = await Category.create({ name, isActive });
        res.status(200).json({ success: true, cat })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/updateCategory/:id', async (req, res) => {
    const { name, isActive } = req.body;
    try {
        const cat = await Category.findByIdAndUpdate(req.params.id, { name, isActive }, { new: true });
        res.status(200).json({ success: true, cat });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/deleteCategory/:id', async (req, res) => {
    try {
        const cat = await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, cat })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router