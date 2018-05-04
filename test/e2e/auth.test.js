const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Auth E2E API', () => {

    beforeEach(() => dropCollection('users'));

    let token = null;

    beforeEach(() => {
        return request
            .post('/auth/signup')
            .send({
                username: 'Julio Martinez',
                password: 'ilovedoingthings',
                role: 'user'
            })
            .then(({ body }) => token = body.token);
    });

    it('signup', () => {
        assert.ok(token);
    });

    it('verifies', () => {
        return request
            .get('/auth/verify')
            .set('Token', token)
            .then(({ body }) => {
                assert.isOk(body.verified);
            });
    });

    it('signin', () => {
        return request
            .post('/auth/signin')
            .send({
                username: 'Julio Martinez',
                password: 'ilovedoingthings'
            })
            .then(({ body }) => {
                assert.ok(body.token);
            });
    });

    it('gives 400 when signing up with existing username', () => {
        return request
            .post('/auth/signup')
            .send({
                username: 'Julio Martinez',
                password: 'ilovedoingthings'
            })
            .then( res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Username already exists');
            });
    });

    it('gives 401 when trying to sign in with unregistered username', () => {
        return request
            .post('/auth/signin')
            .send({
                username: 'bad',
                password: 'evenworse'
            })
            .then( res => {
                assert.equal(res.status, 401),
                assert.equal(res.body.error, 'Invalid username or password');
            });
    });

    it('gives 401 on incorrect password', () => {
        return request
            .post('/auth/signin')
            .send({
                username: 'Julio Martinez',
                password: 'whoopsie'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid username or password');
            });
    });
});
