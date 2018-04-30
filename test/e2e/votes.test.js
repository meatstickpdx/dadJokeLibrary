const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const Answer = require('../../lib/models/Vote');

describe.only('Vote E2E API', () => {

    let user = {
        username: 'Mr. Jones',
        password: 'abc'
    };

    let answer = {
        content: 'To get to the other side',
    };

    let question = {
        prompt: 'Why did the chicken?',
    };

    let vote1 = {
        emoji: ':heart'
    };

    let vote2 = {
        emoji: ':facepalm:'
    };

    before(() => dropCollection('users'));
    before(() => dropCollection('votes'));
    before(() => dropCollection('answers'));
    before(() => dropCollection('questions'));

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    before(() => {
        return request.post('/auth/signup')
            .send(user)
            .then(checkOk)
            .then(( { body }) => {
                user._id = body._id;
                assert.ok(user._id);

                vote1.voter = user._id;
                vote2.voter = user._id;
                question.user = user._id;
            });
    });

    before(() => {
        return request.post('/questions')
            .send(question)
            .then(checkOk)
            .then(({ body }) => {
                question._id = body._id;
                assert.ok(question._id);

                vote1.question = question._id;
                vote2.question = question._id;
            });
    });

    before(() => {
        return request.post('/answers')
            .send(answer)
            .then(checkOk)
            .then(({ body }) => {
                answer._id = body._id;
                assert.ok(answer._id);

                vote1.answer = answer._id;
                vote2.answer = answer._id;
            });
    });

    it('posts a vote', () => {
        return request.post('/votes')
            .send(vote1)
            .then(checkOk)
            .then(( {body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    _id, __v,
                    ...vote1
                });
                vote1 = body;
            });
    });
    
});


//Get ALL
//get by question
//post by question
//put