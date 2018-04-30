const router = require('express').Router(); //eslint-disable-line
const { respond } = require('./route-helpers');
const User = require('../../lib/models/User');
const { sign } = require('../utils/token-service');
const createEnsureAuth = require('../utils/ensure-auth');

const hasUsernameAndPassword = ({body}, res, next) => {
    const { username, password } = body;
    if(!username || !password ) {
        throw {
            status: 400,
            error: 'Email and password are required.'
        };
    }

    next();
};

module.exports = router
    .get('/verify', createEnsureAuth(), respond(
        () => Promise.resolve({ verified: true })
    ))

    .post('/signup', hasUsernameAndPassword, respond(
        ({ body }) => {
            const { username, password } = body;
            delete body.password;

            return User.exists({ username })
                .then(exists => {
                    if(exists) {
                        throw {
                            status: 400,
                            error: 'Username already exists'
                        };
                    }

                    const user = new User(body);
                    user.generateHash(password);
                    return user.save();
                })
                .then(user => {
                    return {
                        token: sign(user),
                        _id: user._id,
                        role: user.role
                    };
                });
        }
    ));