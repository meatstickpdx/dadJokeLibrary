const router = require('express').Router(); //eslint-disable-line
const { getParam, respond } = require('./route-helpers');
const Question = require('../../lib/models/Question');

module.exports = router

    .param('id', getParam)

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
    ))

    .get('/:id', respond(
        ({ id }) => {
            return Question.findById(id)
                .lean()
                .select('prompt');
        }
    ));