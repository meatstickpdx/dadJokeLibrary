const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
// const Answer = require('../../lib/models/Answer');

describe('Answer E2E API', () => {

    let user = {
        username: 'Mr. Jones',
        password: 'abc'
    };

    let answer1 = {
        content: 'To get to the other side',
    };

    let answer2 = {
        content: 'Because its a stupid chicken',
    };

    let question = {
        prompt: 'Why did the chicken?',
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    before(() => dropCollection('users'));
    before(() => dropCollection('answers'));
    before(() => dropCollection('questions'));

    before(() => {
        return request.post('/auth/signup')
            .send(user)
            .then(checkOk)
            .then(( { body }) => {
                user._id = body._id;
                assert.ok(user._id);

                answer1.author = user._id;
                answer2.author = user._id;
            });
    });

    before(() => {
        return request.post('/questions')
            .send(question)
            .then(checkOk)
            .then(({ body }) => {
                question._id = body._id;
                assert.ok(question._id);

                answer1.question = question._id;
                answer2.question = question._id;
            });
    });

    it('saves an answer', () => {
        return request.post('/answers')
            .send(answer1)
            .then(checkOk)
            .then(( {body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    _id, __v,
                    ...answer1,
                    votes: []
                });
                answer1 = body;
            });
    });

    it('gets a review by id', () => {
        return request.post('/answers')
            .send(answer2)
            .then(checkOk)
            .then(({ body }) => {
                answer2 = body;
                assert.ok(answer2._id);
                return request.get(`/answers/${answer2._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, answer2);
            });
    });

    //write post + vote post
});