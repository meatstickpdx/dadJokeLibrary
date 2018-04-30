const router = require('express').Router(); /* eslint-disable-line */
const Answer = require('../models/Answer');
const Question = require('../models/Question');
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

        Promise.all([
            Answer.findById(id)
                .lean()
                .select('content author question votes'),

            // Question.find({ $elemMatch: { answers: id } })
            //     .lean()
            //     .select('status')
        ])
            .then(([answer]) => {
                // check404(answer, question);
                // answer.status = question.status;
                res.json(answer);
            })
            .catch(next);

    })

    .post('/', (req, res, next) => {
        Answer.create(req.body)
            .then(answer => res.json(answer))
            .catch(next);
    });

// .put('/:id', ensureRole('admin'), (req, res, next) => {
//     Actor.findByIdAndUpdate(req.params.id, req.body, updateOptions)
//         .then(actor => res.json(actor))
//         .catch(next);
// })

// .delete('/:id', ensureRole('admin'), (req, res, next) => {
//     const { id } = req.params;

//     Film.find({ cast: { $elemMatch: { actor: id } } })
//         .then(films => {
//             if(!films[0]){
//                 Actor.findByIdAndRemove(id)
//                     .then(removed => res.json({ removed }));
//             } else {
//                 console.log('Films found! Cannot delete.');
//                 res.json(films);
//             }
//         })
//         .catch(next);
// });