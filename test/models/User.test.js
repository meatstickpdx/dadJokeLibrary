const { assert } = require('chai');
const User = require('../../lib/models/User');

describe('User model', () => {
    it('valid and good model', () => {
        const data = {
            name: 'Don Juan John Sean',
            role: 'user'
        };

        const don = new User(data);
        data._id = don._id;
        assert.deepEqual(don.toJSON(), data);
    });

    it('name is required', () => {
        const user = new User({});
        const errors = user.validateSync();
        assert.equal(errors.errors.name.path, 'name');
        assert.equal(errors.errors.name.kind, 'required');
    });

    it('role enum is required', () => {
        const user = new User({ name: 'Test Boi', role: 'boss' });
        const errors = user.validateSync();
        assert.equal(errors.errors.role.kind, 'enum');
    });
});