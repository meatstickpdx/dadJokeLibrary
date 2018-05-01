const router = require('express').Router(); /* eslint-disable-line */
const { updateOptions } = require('../util/mongoose-helpers');
const Vote = require('../models/Vote');

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

module.exports = router

    .get('/', (req, res, next) => {
        req.query.question ? getByQuestion(req, res, next) : getAll (req, res, next);
    })

    .post('/', (req, res, next) => {
        Vote.create(req.body)
            .then(vote => res.json(vote))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Vote.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(updated => res.json(updated))
            .catch(next);
    });