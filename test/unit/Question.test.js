const { assert } = require('chai');
const Question = require('../../lib/models/Question');
//const { getErrors } = require('./helpers');

describe('Question model', () => {

    it('is a valid model', () => {
        const data = {
            prompt: 'This is a dad question',
            answers: ['dads are the best jokesters', 'dads tell horrible jokes'],
            user: 75,
            status: 'submit'
        };
        const question = new Question(data);
        data._id = question._id;
        assert.deepEqual(question.toJSON(), data);
        assert.isUndefined(question.validateSync());

    });
    it('requires fields', () => {

    });
});

