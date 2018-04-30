const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
// const Question = require('../../lib/models/Question');
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

    const getFields = ({ _id, prompt }) => ({ _id, prompt });

    it('gets all questions', () => {
        return request.get('/questions')
            .then(({ body }) => {
                assert.deepEqual(body, [dadBod, dadJoke].map(getFields));
            });
    });

    // const getOneFields = ({ _id, prompt, answers }) => ({ _id, prompt, answers });

    it('get questions by id', () => {
        return request.get(`/questions/${dadBod._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, getFields(dadBod));
            });
    });

    it('put questions by id', () => {
        dadBod.status = 'vote';
        return request.put(`/questions/${dadBod._id}`)
            .send(dadBod)
            .then(({ body }) => {
                assert.deepEqual(body, dadBod);
            });
    });

    it('delete questions by id', () => {
        return request.delete(`/questions/${dadBod._id}`)
            .then(() => {
                return request.get(`/questions/${dadBod._id}`);
            })
            .then(res => {
                assert.strictEqual(res.status, 404);
            });
    });
});