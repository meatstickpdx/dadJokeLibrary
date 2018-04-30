const router = require('express').Router(); //eslint-disable-line
const { respond } = require('./route-helpers');
const Question = require('../../lib/models/Question');

module.exports = router
    .post('/', respond(
        ({ body }) => {
            return Question.create(body);
        }
    ))
    .get('/', respond(
        ({ body }) => {
            return Question.find(body)
                .lean()
                .select('prompt');
        }
    ));