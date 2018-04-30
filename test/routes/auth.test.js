const { assert } = require('chai');
const request = require('./request');

describe.only('Auth API', () => {

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
});