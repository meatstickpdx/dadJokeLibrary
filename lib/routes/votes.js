const router = require('express').Router();
const { getParam, respond } = require('./route-helpers');
const Vote = require('../models/Vote');
const ensureAuth = require('../util/ensure-auth');
const ensureRole = require('../util/ensure-role');

module.exports = router

    .param('id', getParam)

    .get('/', ensureAuth(), respond(
        // `req.query` returns an empty object, so no need to use find twice.
        // Don't skip data just because it was in the query
        (req) => {
            return Vote.find(req.query).lean().select('emoji question answer');
        }
    ))

    .get('/results', respond(
        ({ query }) => {
            return Vote.getTally(query.question);
        }
    ))

    // what is use case for getting "all" of my votes?
    // maybe should be `/:id/mine`?
    .get('/myVotes', ensureAuth(), respond(
        ({ user }) => {
            return Vote.find({ 'voter': user.id});
        }
    ))

    .post('/', ensureAuth(), respond(
        ({ body, user }) => {
            const { question, emoji } = body;
            const { id } = user;
            body.voter = id;
            // curious what was issue the required ".toString()" on emoji...
            return Vote.exists(question, id, emoji.toString())
                .then((exists) => {
                    if (exists) {
                        // this needs to be an error
                        throw { status: 400, error: 'Cannot vote twice' };
                    }
                    
                    return Vote.create(body);
                });
        }
    ))

    // curious, what is the use case for this route?
    .put('/:id', ensureRole('admin'), ensureAuth(), respond(
        ({ id, body }) => {
            return Vote.updateById(id, body);
        }
    ));