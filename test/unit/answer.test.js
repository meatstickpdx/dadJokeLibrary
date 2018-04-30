const { assert } = require('chai');
const { Types } = require('mongoose');
const { getErrors } = require('./helpers');
const Answer = require('../../lib/models/Answer');


describe('Actor model', () => {

    it('valid good model w/o votes', () => {
        const data = {
            content: 'To get to the other side.',
            question:  Types.ObjectId(), //eslint-disable-line
        };

        const answer = new Answer(data);
        data._id = answer._id;
        assert.deepEqual(answer.toJSON(), {
            ...data,
            votes: [] });
        assert.isUndefined(answer.validateSync());
    });

    it('valid good model w/votes', () => {
        const data = {
            content: 'To get to the other side.',
            question:  Types.ObjectId(), //eslint-disable-line
            votes: [{
                emoji: ':facepalm:',
                voter:  Types.ObjectId(), //eslint-disable-line
            }]
        };

        const answer = new Answer(data);
        data._id = answer._id;
        data.votes[0]._id = answer.votes[0]._id;
        assert.deepEqual(answer.toJSON(), data);
        assert.isUndefined(answer.validateSync());
    });

    it('answer requires content, question', () => {
        const answer = new Answer({});
        const errors = getErrors(answer.validateSync(), 2);
        assert.equal(errors.content.kind, 'required');
        assert.equal(errors.question.kind, 'required');
    });

    it('votes require emoji enum, voter', () => {
        const actor = new Answer({
            content: 'to get to the other side.',
            question:  Types.ObjectId(), //eslint-disable-line
            votes: [{ emoji: ':lol:'}]
        });
        const errors = getErrors(actor.validateSync(), 2);
        assert.equal(errors['votes.0.emoji'].kind, 'enum');
        assert.equal(errors['votes.0.voter'].kind, 'required');

    });
});