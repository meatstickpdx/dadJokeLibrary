const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const Question = require('../../lib/models/Question');
// const { Types } = require('mongoose');

describe.only( 'Question API', () => {
    before(() => dropCollection('questions'));

    let dadJoke = {
        prompt: 'This is a dad question',
        answers: ['dads are the best jokesters', 'dads tell horrible jokes'],
        user: 75,
        status: 'submit'
    };

    let dadBod = {
        prompt: '{ dadBod }',
        answers: ['code joke', 'other funny things'],
        user: 12,
        status: 'submit'
    };

    before(() => {
        return request.post('/questions')
            .send(dadBod)
            .then(({ body }) => {
                dadBod = body;
            });
    });

    it('saves a question', () => {
        return request.post('/questions')
            .send(dadJoke)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal( __v, 0);
                assert.deepEqual(body, {
                    ...dadJoke,
                    _id,
                    __v
                });
                dadJoke = body;
            });

    });

    it('gets all questions', () => {
        return request.get('/questions')
            .then(({ body }) => {
                assert.deepEqual(body, [dadBod, dadJoke]);
            });
    });
});