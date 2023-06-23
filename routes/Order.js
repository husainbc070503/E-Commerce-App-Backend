require('dotenv').config();
const ValidUser = require('../middleware/ValidUser');
const Order = require('../models/Order');
const router = require('express').Router();
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');

const sendReceipt = async (totalPrice, email, order_id) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        },
        tls: { rejectUnauthorized: false }
    });

    const options = {
        from: process.env.USER,
        to: email,
        subject: "Champa Store Receipt",
        text: `Order Confirmed. Total Price: Rs.${totalPrice}/-. We will try to deliver your order as soon as possible. Your Order ID: ${order_id}. Thanking you.`
    }

    await new Promise((resolve, reject) => {
        transporter.sendMail(options, (err, info) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log('Email sent successfully');
                resolve(info);
            }
        })
    })
}

const rzp = new Razorpay({
    key_id: "rzp_test_FlqRfa8gpkyIvH",
    key_secret: "eArahzoMi3ZwNGpqOoPruXne"
});

router.post('/pay', ValidUser, async (req, res) => {
    const { products, totalPrice } = req.body;

    try {
        let pros = JSON.parse(products);
        let userQuantity = pros.map((p) => p.userQuantity);

        let order = await Order.create({ user: req.user._id, products: pros, totalPrice, userQuantity });
        order = await Order.findById(order._id).populate('user', '-password');

        if (order) {
            const payment_capture = 1;
            const amount = order.totalPrice * 100;
            const currency = "INR";

            const options = { amount, currency, payment_capture }

            try {

                const resp = await rzp.orders.create(options);
                sendReceipt(totalPrice, order.user.email, resp.id);

                res.status(200).json({
                    success: true,
                    order,
                    id: resp.id,
                    amount: resp.amount,
                    name: "Champa Store",
                    description: resp.description
                })

            } catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }

        } else {
            res.status(400).json({ success: false, message: 'Server Error' });
        }

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
})

router.get('/getAllOrders', async (req, res) => {
    try {
        const orders = await Order.find().populate('user', '-password').populate('products', ['name']);
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
})

router.put('/updateOrder', async (req, res) => {
    const { id, isDelivered } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(id, { isDelivered }, { new: true })
            .populate('user', '-password').populate('products', 'name');

        res.status(400).json({ success: true, order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
})

router.delete('/deleteAll', async (req, res) => {
    const orders = await Order.deleteMany();
    res.status(200).json(orders);
})

module.exports = router;