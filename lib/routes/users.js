const router = require('express').Router(); // eslint-disable-line
const User = require('../models/User');
const ensureRole = require('../util/ensure-role');

const check404 = (user, id) => {
    if(!user) {
        throw {
            status: 404,
            error: `User id ${id} does not exist.`
        };
    }
};

module.exports = router
    .get('/', (req, res, next) => {
        User.find(req.query)
            .lean()
            .then(users => res.json(users))
            .catch(next);
    });

    // .get('/:id', (req, res, next) => {
    //     const { id } = req.params;

    //     return User.findById(id)
    //         .lean()
    //         .check404(body)
    // });