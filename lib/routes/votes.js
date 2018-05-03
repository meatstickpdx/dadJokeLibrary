const router = require('express').Router(); /* eslint-disable-line */
const { updateOptions } = require('../util/mongoose-helpers');
const { respond } = require('./route-helpers');
const Vote = require('../models/Vote');
const ensureAuth = require('../util/ensure-auth');
const ensureRole = require('../util/ensure-role');


const getAll = (req, res, next) => {
    Vote.find()
        .lean()
        .select('emoji question answer')
        .then(votes => res.json(votes))
        .catch(next);
};

const getByQuestion = (req, res, next) => {
    Vote.find(req.query)
        .lean()
        .select('emoji answer')
        .then(votes => res.json(votes))
        .catch(next);
};

const getByUser = (req, res, next) => {
    Vote.find({'voter': req.user._id})
        .lean()
        .then(votes => res.json(votes))
        .catch(next);
};

module.exports = router

    .get('/', (req, res, next) => {
        req.query.question ? getByQuestion(req, res, next) : getAll(req, res, next);
    })

    .get('/results', respond(
        ({ query }) => {
            console.log(query.question);
            return Vote.tallyVote(query.question);
        }
    ))


    .get('/myVotes', ensureAuth(), (req, res, next) => {
        Vote.find({'voter': req.user.id})
            .lean()
            .then(votes => res.json(votes))
            .catch(next);
    })

    .post('/', ensureAuth(), (req, res, next) => {
        
        
        const { question, emoji } = req.body;
        const { id } = req.user;
        req.body.voter = id;
        Vote.checkVote(question, id, emoji.toString())
            .then( ( response ) => {
                console.log('RESPONSE', response);
                if (response.length){
                    res.json('Cannot vote twice');
                } else {
                    Vote.create(req.body)
                        .then(vote => res.json(vote))
                        .catch(next);
                }
            });

    })

    .put('/:id', ensureRole('admin'), ensureAuth(), (req, res, next) => {
        Vote.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(updated => res.json(updated))
            .catch(next);
    });