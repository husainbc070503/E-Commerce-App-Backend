require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const ConnectToDB = require('./connection/conn');
const port = process.env.PORT

ConnectToDB();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send("Hello world"));

app.use('/api/user', require('./routes/Auth'));
app.use('/api/category', require('./routes/Category'));
app.use('/api/company', require('./routes/Company'));
app.use('/api/product', require('./routes/Products'));
app.use('/api/order', require('./routes/Order'));
app.use('/api/review', require('./routes/Review'));

app.listen(port, console.log(`Server connected to port ${port}`));