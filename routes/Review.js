const ValidUser = require('../middleware/ValidUser');
const Review = require('../models/Review');
const router = require('express').Router();

router.post('/addReview', ValidUser, async (req, res) => {
    const { rating, review, isRecommended, pro } = req.body;

    try {

        let rev = await Review.create({ rating, review, isRecommended, product: pro, user: req.user._id });
        rev = await Review.findById(rev._id).populate('user', '-password').populate('product');

        res.status(200).json({ success: true, rev });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
});

router.get('/getReviews/:id', async (req, res) => {
    try {
        const revs = await Review.find({ product: req.params.id }).populate('user', ['name', 'avatar']);
        res.status(200).json({ success: true, revs });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
})

router.get('/getAllReviews', async (req, res) => {
    try {
        const revs = await Review.find().populate('user', ['name', 'avatar']);
        res.status(200).json({ success: true, revs });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
})

router.delete('/deleteReview/:id', ValidUser, async (req, res) => {
    try {
        const rev = await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, rev });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
})

module.exports = router