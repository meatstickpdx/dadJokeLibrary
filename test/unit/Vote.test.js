const { assert } = require('chai');
const { Types } = require('mongoose');
const { getErrors } = require('./helpers');
const Vote = require('../../lib/models/Vote');


describe('Vote model', () => {

    it('valid good model', () => {
        const data = {
            emoji: '🤦',
            voter:  Types.ObjectId(),
            question:  Types.ObjectId(),
            answer:  Types.ObjectId(),
        };

        const vote = new Vote(data);
        data._id = vote._id;
        assert.deepEqual(vote.toJSON(), data);
        assert.isUndefined(vote.validateSync());
    });

    it('votes require emoji, voter, question, user', () => {
        const vote = new Vote({});
        const errors = getErrors(vote.validateSync(), 4);
        assert.equal(errors.voter.kind, 'required');
        assert.equal(errors.emoji.kind, 'required');
        assert.equal(errors.question.kind, 'required');
        assert.equal(errors.answer.kind, 'required');
    });

    it('votes require emoji enum', () => {
        const vote = new Vote({
            emoji: ':lol:',
            voter:  Types.ObjectId(),
            question:  Types.ObjectId(),
            answer:  Types.ObjectId(),
        });
        const errors = getErrors(vote.validateSync(), 1);
        assert.equal(errors.emoji.kind, 'enum');
    });
});