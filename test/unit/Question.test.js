const { assert } = require('chai');
const Question = require('../../lib/models/Question');
const Answer = require('../../lib/models/Answer');
const { getErrors } = require('./helpers');

describe.only('Question model', () => {

    const punchline = {
        content: 'It got mugged'
    };

    const data = {
        prompt: 'Why did the coffee file a police report',
        user: 75,
        status: 'submit'
    };

    const answer = new Answer(punchline);

    it('is a valid model', () => {
        data.answers = [answer._id];
        const question = new Question(data);
        data._id = question._id;
        assert.deepEqual(question.toJSON(), data);
        assert.isUndefined(question.validateSync());

    });

    it('requires fields', () => {
        const question = new Question({});
        const errors = getErrors(question.validateSync(), 1);
        assert.equal(errors.prompt.kind, 'required');
    });

    it('checks that status is an enum', () => {
        const question = new Question({ prompt: 'This is a dad question', status: 'fail' });
        const errors = getErrors(question.validateSync(), 1);
        assert.equal(errors.status.kind, 'enum');
    });
});

