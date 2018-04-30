const router = require('express').Router(); /* eslint-disable-line */
const Vote = require('../models/Vote');

const check404 = (vote, id) => {
    if(!vote) {
        throw {
            status: 404,
            error: `Vote id ${id} does not exist.`
        };
    }
};

module.exports = router
    .get('/', (req, res, next) => {
        Vote.find(req.query)
            .lean()
            // .select('content question')
            .then(votes => res.json(votes))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Vote.findById(id)
            .lean()
            .then(vote => {
                check404(vote, id);
                res.json(vote);
            })
            .catch(next);
    })

    .post('/', (req, res, next) => {
        Vote.create(req.body)
            .then(vote => res.json(vote))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Vote.findByIdAndRemove(req.params.id)
            .then(removed => res.json({ removed }))
            .catch(next);
    });