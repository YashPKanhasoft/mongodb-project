const express = require("express");
require('dotenv').config()
let app = express();
const cors = require('cors');
const path= require('path')
const bodyParser = require("body-parser");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb", limit: "100mb" }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/images', express.static('images'));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));
let connectdb = require('./cofig/db');
connectdb();
let routes = require('./Routes/index');
app.use('/', routes);
app.listen(5009, () => {
    console.log("server is listening on port 5009");
})

