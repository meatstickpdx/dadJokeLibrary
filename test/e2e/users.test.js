const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('User E2E API', () => {

    let token = null;

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    const admin = {
        username: 'Josephine',
        password: 'sweettarts',
        role: 'admin'
    };

    const user = {
        username: 'Joline',
        password: 'otherwoman',
        role: 'user'
    };
    
    before(() => dropCollection('users'));

    before(() => {
        return request
            .post('/auth/signup')
            .send(admin)
            .then(checkOk)
            .then(( { body }) => {
                admin._id = body._id;
                assert.ok(body.role);
                token = body.token;
            });
    });

    before(() => {
        return request
            .post('/auth/signup')
            .send(user)
            .then(checkOk)
            .then(({ body }) => {
                user._id = body._id;
                assert.ok(body.role);
            });
    });

    it('Retrieves users', () => {
        return request.get('/users')
            .set('Token', token)
            .set('Authorization', admin.role)
            .then(( { body }) => {
                assert.deepEqual(body[0]._id, admin._id);
                assert.deepEqual(body[1]._id, user._id);
                assert.equal(body.length, 2);
            });
    });

    it('Blocks non-admins from retrieving users', () => {
        return request.get('/users')
            .then(( { body }) => {
                assert.deepEqual(body.error, 'Requires admin role');
            });
    });
});