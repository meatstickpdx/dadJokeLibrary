const router = require('express').Router(); //eslint-disable-line
const { getParam, respond } = require('./route-helpers');
// const { updateById } = require('../models/register-plugin');
const Question = require('../../lib/models/Question');
const ensureRole = require('../util/ensure-role');
const ensureAuth = require('../util/ensure-auth');

module.exports = router

    .param('id', getParam)

    .post('/', ensureAuth(), respond(
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

    .get('/:id/answers', respond(
        ({ id }) => {
            return Question.findById(id)
                .lean()
                .select('prompt answers')
                .populate({
                    path: 'answers',
                    select: 'content'
                });
        }
    ))

    .get('/:id', respond(
        ({ id }) => {
            return Question.findById(id)
                .lean()
                .select('prompt');
        }
    ))

    .put('/:id', ensureRole('admin'), ensureAuth(), respond(
        ({ id, body }) => Question.updateById(id, body)
    ))

    .delete('/:id', ensureRole('admin'), ensureAuth(), respond(
        ({ id }) => Question.findByIdAndRemove(id)
    ));
