const router = require('express').Router();
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

    // this doesn't seem like a separate route, just a query
    .get('/voting', respond(
        () => {
            // why would this be findOne? 
            // is this a work around for the UI? :(
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

    // this route, as written, doesn't make a lot of sense. 
    // Why would you update all questions at once?
    .put('/', ensureRole('admin'), ensureAuth(), respond(
        () => Question.update({ status: 'vote' }, { status: 'submit' }, { multi: true })
    ))

    // would be better to make this more specific, like `/:id/status/vote`
    .put('/:id', ensureRole('admin'), ensureAuth(), respond(
        ({ id }) => Question.update({ _id: id }, { $set:{ status: 'vote'} })
    ))

    .delete('/:id', ensureRole('admin'), ensureAuth(), respond(
        ({ id }) => Question.findByIdAndRemove(id)
    ));