const router = require('express').Router();
const { respond } = require('./route-helpers');
const User = require('../models/User');
const ensureRole = require('../util/ensure-role');
const ensureAuth = require('../util/ensure-auth');

module.exports = router
    .get('/', ensureRole('admin'), ensureAuth(), respond(
        ({ query }) => {
            return User.find(query)
                // leaking security data :(
                .select('-hash')
                .lean();
        }
    ));