const router = require('express').Router(); /* eslint-disable-line */
const { getParam, respond } = require('./route-helpers');
const Vote = require('../models/Vote');
const ensureAuth = require('../util/ensure-auth');
const ensureRole = require('../util/ensure-role');

module.exports = router

    .param('id', getParam)

    .get('/', ensureAuth(), respond(
        (req) => req.query.question ? Vote.find(req.query).lean().select('emoji answer') : Vote.find().lean().select('emoji question answer')
    ))

    .get('/results', respond(
        ({ query }) => {
            return Vote.tallyVote(query.question);
        }
    ))

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
            return Vote.checkVote(question, id, emoji.toString())
                .then((response) => {
                    if (response.length){
                        return 'Cannot vote twice';
                    } else {
                        return Vote.create(body);
                    }
                });
        }
    ))

    .put('/:id', ensureRole('admin'), ensureAuth(), respond(
        ({ id, body }) => {
            return Vote.updateById(id, body);
        }
    ));