var express = require('express');
var app = express();

require('dotenv').config()

app.use('/api/v1',require('./api/v1/app'));

module.exports = app;