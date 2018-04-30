const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./util/error-handler');
require('./models/register-plugin');

app.use(morgan('dev'));

const auth = require('./routes/auth');
const users = require('./routes/users');
const answers = require('./routes/answers');
const questions = require('./routes/questions');

app.use(express.json());

app.use('/auth', auth);
app.use('/users', users);
app.use('/answers', answers);
app.use('/questions', questions);
app.use(express.static('public'));

app.use(errorHandler());

module.exports = app;