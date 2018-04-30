const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));

const auth = require('./routes/auth');

app.use(express.json());

app.use('/auth', auth);

module.exports = app;