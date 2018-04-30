const router = require('express').Router(); /* eslint-disable-line */
const Answer = require('../models/Answer');
// const Question = require('../models/Question');
// const { updateOptions } = require('../util/mongoose-helpers');

const check404 = (answer, id) => {
    if(!answer) {
        throw {
            status: 404,
            error: `Answer id ${id} does not exist.`
        };
    }
};

module.exports = router
    .get('/', (req, res, next) => {
        Answer.find(req.query)
            .lean()
            .select('content question')
            .then(answers => res.json(answers))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;

        Answer.findById(id)
            .lean()
            .then(answer => {
                check404(answer, id);
                res.json(answer);
            })
            .catch(next);
    })

    .post('/', (req, res, next) => {
        Answer.create(req.body)
            .then(answer => res.json(answer))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Answer.findByIdAndRemove(req.params.id)
            .then(removed => res.json({ removed }))
            .catch(next);
    });