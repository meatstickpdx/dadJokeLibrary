const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.only('Auth API', () => {

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
            .set('Authorization', token)
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

});