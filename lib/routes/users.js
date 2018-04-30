const router = require('express').Router(); // eslint-disable-line
const User = require('../models/User');
const ensureRole = require('../util/ensure-role');

module.exports = router
    .get('/', ensureRole('admin'), (req, res, next) => {
        User.find(req.query)
            .lean()
            .then(users => res.json(users))
            .catch(next);
    });