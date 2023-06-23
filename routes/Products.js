const Products = require('../models/Products');
const router = require('express').Router();

router.get('/getAllProducts', async (req, res) => {
    try {
        const pros = await Products.find().populate('category', ['name', 'isActive']).populate('company', ['name', 'isProductsAvalaible']);
        res.status(200).json({ data: pros, count: pros.length });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
});

router.post('/addProduct', async (req, res) => {
    const { name, description, image, category, company, price, quantity, featured } = req.body;

    try {
        if (!name || !description || !category || !company || !price || !quantity)
            return res.status(400).json({ success: false, message: 'Please fill all the required fields' });

        let pro = await Products.findOne({ name, category, company });
        if (pro) return res.status(200).json({ success: false, message: "Item already exists!" })

        pro = await Products.create({ name, description, image, category, company, price, quantity, featured });
        pro = await Products.findById(pro._id).populate('category').populate('company');

        res.status(200).json({ success: true, pro });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
});

router.put('/updateProduct/:id', async (req, res) => {
    const { name, description, category, company, price, quantity, image, featured } = req.body;
    try {
        const newProduct = {};
        if (name) newProduct.name = name;
        if (description) newProduct.description = description;
        if (price) newProduct.price = price;
        if (quantity) newProduct.quantity = quantity;
        if (category) newProduct.category = category;
        if (company) newProduct.company = company;
        if (image) newProduct.image = image;
        if (featured) newProduct.featured = featured;

        const pro = await Products.findByIdAndUpdate(req.params.id, newProduct, { new: true })
            .populate('category').populate('company');

        res.status(200).json({ success: true, pro })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
});

router.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const pro = await Products.findOneAndDelete(req.params.id);
        res.status(200).json({ success: true, pro });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
});

router.get('/getProduct/:id', async (req, res) => {
    try {
        const pro = await Products.findById(req.params.id).populate('category').populate('company');
        res.status(200).json({ success: true, pro })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
})

module.exports = router;
