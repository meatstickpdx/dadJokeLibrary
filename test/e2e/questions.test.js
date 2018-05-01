const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
// const Question = require('../../lib/models/Question');
// const { Types } = require('mongoose');

describe( 'Question API', () => {
    before(() => dropCollection('questions'));
    before(() => dropCollection('users'));

    let token = null;

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
        return request.post('/auth/signup')
            .send({ username: 'JoeBob', password: 'hyuk' })
            .then(({ body }) => {
                token = body.token;
            });
    });

    before(() => {
        return request.post('/questions')
            .set('Token', token)
            .send(dadBod)
            .then(({ body }) => {
                dadBod = body;
            });
    });

    it('saves a question', () => {
        return request.post('/questions')
            .set('Token', token)
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
            .set('Token', token)
            .set('Authorization', 'admin')
            .then(({ body }) => {
                assert.deepEqual(body, [dadBod, dadJoke].map(getFields));
            });
    });

    // const getOneFields = ({ _id, prompt, answers }) => ({ _id, prompt, answers });

    it('get questions by id', () => {
        return request.get(`/questions/${dadBod._id}`)
            .set('Token', token)
            .set('Authorization', 'admin')
            .then(({ body }) => {
                assert.deepEqual(body, getFields(dadBod));
            });
    });

    it('put questions by id', () => {
        dadBod.status = 'vote';
        return request.put(`/questions/${dadBod._id}`)
            .set('Authorization', 'admin')
            .set('Token', token)
            .send(dadBod)
            .then(({ body }) => {
                assert.deepEqual(body, dadBod);
            });
    });

    it('delete questions by id', () => {
        return request.delete(`/questions/${dadBod._id}`)
            .set('Token', token)
            .set('Authorization', 'admin')
            .then(() => {
                return request.get(`/questions/${dadBod._id}`)
                    .set('Token', token)
                    .set('Authorization', 'admin');
            })
            .then(res => {
                assert.strictEqual(res.status, 404);
            });
    });
});