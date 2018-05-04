const router = require('express').Router(); //eslint-disable-line
const { getParam, respond } = require('./route-helpers');
const Question = require('../../lib/models/Question');
const ensureRole = require('../util/ensure-role');
const ensureAuth = require('../util/ensure-auth');

module.exports = router

    .param('id', getParam)

    .post('/', ensureAuth(), respond(
        ({ body, user }) => {
            const { id } = user;
            body.user = id;
            return Question.create(body);
        }
    ))

    .get('/', respond(
        () => {
            return Question.find()
                .lean()
                .select('prompt status');
        }
    ))

    .get('/voting', respond(
        () => {
            return Question.findOne({
                status: 'vote'
            })
                .lean()
                .select('_id prompt');
        }
    ))

    .get('/:id', respond(
        ({ id }) => {
            return Question.findById(id)
                .lean()
                .select('prompt status');
        }
    ))

    .put('/', ensureRole('admin'), ensureAuth(), respond(
        () => Question.update({ status: 'vote' }, { status: 'submit' }, { multi: true })
    ))

    .put('/:id', ensureRole('admin'), ensureAuth(), respond(
        ({ id }) => Question.update({ _id: id }, {$set:{ status: 'vote'}})
    ))

    .delete('/:id', ensureRole('admin'), ensureAuth(), respond(
        ({ id }) => Question.findByIdAndRemove(id)
    ));