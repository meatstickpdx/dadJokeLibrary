const router = require('express').Router();
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
        ({ query }) => {
            return Answer.find(query)
                .lean()
                .select('content question');
        }
    ))

    // this case is already covered above
    // .get('/all', respond(
    //     ({ query }) => {
    //         return Answer.find({ 'question': query.question})
    //             .lean();
    //     }
    // ))

    .get('/:id', respond(
        ({ id }) => {
            return Answer.findById(id)
                .lean();
        }
    ))
    
    // you can't check role until you get the payload from the token!
    .delete('/:id', ensureAuth(), ensureRole('admin'), respond(
        ({ id }) => {
            return Answer.findByIdAndRemove(id);
        }
    ));