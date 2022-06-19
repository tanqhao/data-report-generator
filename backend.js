const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
dotenv.config()

const app = express();

const router = require("./router");

//const mongoose = require("mongoose")

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//app.use(express.static('public'));
// app.set('views', 'views')
// app.set('view engine', 'ejs')

app.use('/', router);


module.exports = app;
