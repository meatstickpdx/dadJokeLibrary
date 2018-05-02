const { assert } = require('chai');
const { Types } = require('mongoose');
const { getErrors } = require('./helpers');
const Answer = require('../../lib/models/Answer');

describe('Answer model', () => {

    it('valid good model', () => {
        const data = {
            content: 'To get to the other side.',
            author: Types.ObjectId(),
            question:  Types.ObjectId(), //eslint-disable-line
        };

        const answer = new Answer(data);
        data._id = answer._id;
        assert.deepEqual(answer.toJSON(), data);
        assert.isUndefined(answer.validateSync());
    });

    it('answer requires content, question', () => {
        const answer = new Answer({});
        const errors = getErrors(answer.validateSync(), 2);
        assert.equal(errors.content.kind, 'required');
        assert.equal(errors.question.kind, 'required');
    });
});