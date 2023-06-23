require('dotenv').config();
const mongoose = require('mongoose');
const url = process.env.MONGODB_URL

const ConnectToDB = async () => {
    mongoose.set('strictQuery', false)
    try {
        await mongoose.connect(url, () => console.log("Database connection established!"));
    } catch (error) {
        console.log(error.message)
        process.exit(1);
    }
}

module.exports = ConnectToDB;