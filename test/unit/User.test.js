const { assert } = require('chai');
const User = require('../../lib/models/User');

describe('User model', () => {
    it('valid and good model', () => {
        const data = {
            username: 'Don Juan John Sean',
            role: 'user'
        };

        const don = new User(data);
        data._id = don._id;
        assert.deepEqual(don.toJSON(), data);
    });

    it('username is required', () => {
        const user = new User({});
        const errors = user.validateSync();
        assert.equal(errors.errors.username.path, 'username');
        assert.equal(errors.errors.username.kind, 'required');
    });

    it('role enum is required', () => {
        const user = new User({ username: 'Test Boi', role: 'boss' });
        const errors = user.validateSync();
        assert.equal(errors.errors.role.kind, 'enum');
    });
});