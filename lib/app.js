const express = require('express');
const app = express();
const morgan = require('morgan');
require('./models/register-plugin');

app.use(morgan('dev'));

const auth = require('./routes/auth');
const users = require('./routes/users');

app.use(express.json());

app.use('/auth', auth);
app.use('/users', users);
app.use(express.static('public'));

module.exports = app;