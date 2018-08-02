const router = require('express').Router(); /* eslint-disable-line */
const { getParam, respond } = require('./route-helpers');
const Answer = require('../models/Answer');
const ensureRole = require('../util/ensure-role');
const ensureAuth = require('../util/ensure-auth');

module.exports = router

    .param('id', getParam)

    .post('/', ensureAuth(), respond(
        ({ body, user }) => {
            body.author = user.id;
            return Answer.create(body);
        }
    ))
    
    .get('/', respond(
        ({ query }) => Answer.find(query)
            .lean()
            .select('content question')
    ))

    .get('/all', respond(
        ({ query }) => Answer.find({ 'question': query.question})
            .lean()
    ))

    .get('/:id', respond(
        ({ id }) => Answer.findById(id)
            .lean()
    ))
    
    .delete('/:id', ensureRole('admin'), ensureAuth(), respond(
        ({ id }) => Answer.findByIdAndRemove(id)
    ));