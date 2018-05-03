const router = require('express').Router(); // eslint-disable-line
const User = require('../models/User');
const ensureRole = require('../util/ensure-role');
const ensureAuth = require('../util/ensure-auth');

module.exports = router
    .get('/', ensureRole('admin'), ensureAuth(), (req, res, next) => {
        User.find(req.query)
            .lean()
            .then(users => res.json(users))
            .catch(next);
    });
    
