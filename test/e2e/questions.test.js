const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const Question = require('../../lib/models/Question');
// const { Types } = require('mongoose');

describe.only( 'Question API', () => {
    before(() => dropCollection('questions'));

    const dadJoke = {
        prompt: 'This is a dad question',
        answers: ['dads are the best jokesters', 'dads tell horrible jokes'],
        user: 75,
        status: 'submit'
    };
    it('saves a question', () => {
        return request.post('/questions')
            .send(dadJoke)
            .then(({ body }) => {
                // saved = saved.toJSON();
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal( __v, 0);
                assert.deepEqual(body, {
                    ...dadJoke,
                    _id,
                    __v
                });
            });

    });
});