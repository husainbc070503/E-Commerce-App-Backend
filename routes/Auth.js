require('dotenv').config();
const User = require('../models/User');
const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const generateToken = require('../utils/GenToken');
const nodemailer = require('nodemailer');
const Token = require('../models/Token');
const ValidUser = require('../middleware/ValidUser');

const mailer = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
        },
        tls: { rejectUnauthorized: false }
    });

    const options = {
        from: process.env.USER,
        to: email,
        subject: "Champa Store",
        text: `Your OTP for updating password is ${token}. Please don't share it with anyone`
    }

    await new Promise((resolve, reject) => {
        transporter.sendMail(options, (err, info) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log('Email sent successfully.');
                resolve(info);
            }
        })
    })
}

/* REGISTRATION */
router.post('/register', async (req, res) => {
    const { name, email, password, avatar, address, type, phone } = req.body;

    try {
        if (!name || !email || !password)
            return res.status(400).json({ success: false, message: "Please fill all the required fields" })

        var user = await User.findOne({ email });
        if (user)
            return res.status(400).json({ success: false, message: "User already exits. Please continue with another account" });

        const salt = await bcryptjs.genSalt(10);
        const secPassword = await bcryptjs.hash(password, salt);

        user = await User.create({ name, email, password: secPassword, address, avatar, role: type, phone });
        res.status(200).json({ success: true, user });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }

});

/* LOGIN */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {

        if (!email || !password)
            return res.status(400).json({ success: false, message: "Please fill all the required fields" })

        var user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ success: false, message: "No user fetched. Please try again." });

        const result = await bcryptjs.compare(password, user.password);
        if (!result)
            return res.status(400).json({ success: false, message: "Invalid credentials." });

        console.log(generateToken(user._id));
        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                address: user.address,
                avatar: user.avatar,
                phone: user.phone,
                token: generateToken(user._id)
            }
        })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
});

/* SEND OTP */
router.post('/sendOtp', async (req, res) => {
    const { email } = req.body;
    try {

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ success: false, message: 'No user found. Please register yourself' });

        const token = await Token.create({
            email,
            otp: Math.floor(Math.random() * 10000),
            expiresIn: new Date().getTime() + 500 * 100
        })

        mailer(email, token.otp);
        res.status(200).json({ success: true, token });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
});

/* UPDATE PASSWORD */
router.post('/updatePassword', async (req, res) => {
    const { email, otp, password } = req.body;

    try {

        const tok = await Token.findOne({ email, otp });

        if (tok) {
            console.log("Yes");
            const diff = tok.expiresIn - new Date().getTime();
            if (diff < 0)
                return res.status(400).json({ success: false, message: "OTP Expired. Try again later." });

            const salt = await bcryptjs.genSalt(10);
            const secPassword = await bcryptjs.hash(password, salt);

            const user = await User.findOneAndUpdate({ email }, { password: secPassword }, { new: true });

            if (user)
                res.status(200).json({ success: true, user });
            else
                res.status(400).json({ success: false, message: "Failed to update password" });
        }
        else {
            res.status(400).json({ success: false, message: 'Token expired' });
        }

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
})

/* UPDATE PASSWORD */
router.post('/updateProfile', ValidUser, async (req, res) => {
    const { name, email, address, avatar, phone } = req.body;

    try {

        const user = await User.findByIdAndUpdate(req.user._id,
            { name, email, address, avatar, phone },
            { new: true });

        res.status(200).json({ success: true, user })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
})

module.exports = router;
