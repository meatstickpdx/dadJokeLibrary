const router = require('express').Router(); /* eslint-disable-line */
const { updateOptions } = require('../util/mongoose-helpers');
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
    Vote.find({'voter': req.query.user})
        .lean()
        .then(votes => res.json(votes))
        .catch(next);
};

module.exports = router

    .get('/', ensureAuth(), (req, res, next) => {
        if (req.query.question) getByQuestion(req, res, next);
        else if (req.query.user) getByUser(req, res, next);
        else getAll(req, res, next);
    })

    .post('/', ensureAuth(), (req, res, next) => {
        
        const { question, voter, emoji } = req.body;
        Vote.checkVote(question, voter, emoji)
            .then( ( response ) => {
                if (response.length){
                    res.send('Cannot vote twice');
                    next();
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