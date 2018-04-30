const router = require('express').Router(); //eslint-disable-line
const { getParam, respond } = require('./route-helpers');
const { updateById } = require('../models/register-plugin');
const Question = require('../../lib/models/Question');
const ensureRole = require('../util/ensure-role');

module.exports = router

    .param('id', getParam)

    .post('/', respond(
        ({ body }) => {
            return Question.create(body);
        }
    ))

    .get('/', ensureRole('admin'), respond(
        ({ body }) => {
            return Question.find(body)
                .lean()
                .select('prompt');
        }
    ))

    .get('/:id', ensureRole('admin'), respond(
        ({ id }) => {
            return Question.findById(id)
                .lean()
                .select('prompt');
        }
    ))

    .put('/:id', ensureRole('admin'), respond(
        ({ id, body }) => Question.updateById(id, body)
    ))

    .delete('/:id', ensureRole('admin'), respond(
        ({ id }) => Question.findByIdAndRemove(id)
    ));