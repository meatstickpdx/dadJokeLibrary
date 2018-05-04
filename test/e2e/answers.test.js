const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const Answer = require('../../lib/models/Answer');

describe('Answer E2E API', () => {

    let token = null;

    const user = {
        username: 'Mr. Jones',
        password: 'abc',
        role: 'admin'
    };

    let answer1 = {
        content: 'To get to the other side',
    };

    const answer2 = {
        content: `Because it's a stupid chicken`,
    };

    const question = {
        prompt: 'Why did the chicken?',
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    const getAllFields = ({ _id, content, question}) => {
        return {
            _id, content, question
        };
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

                question.user = user._id;
                token = body.token;

                answer1.author = user._id;
                answer2.author = user._id;
            });
    });

    before(() => {
        return request.post('/questions')
            .set('Token', token)
            .send(question)
            .then(checkOk)
            .then(({ body }) => {
                question._id = body._id;
                assert.ok(question._id);

                answer1.question = question._id;
                answer2.question = question._id;
            });
    });

    before(() => {
        return request.post('/answers')
            .set('Token', token)
            .send(answer2)
            .then(({ body }) => {
                answer2._id = body._id;
            });
    });

    it('saves an answer', () => {
        return request.post('/answers')
            .set('Token', token)
            .send(answer1)
            .then(checkOk)
            .then(( {body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    _id, __v,
                    ...answer1
                });
                answer1 = body;
            });
    });

    it('gets all answers', () => {
        return request.get('/answers')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [answer2, answer1].map(getAllFields));
            });
    });

    it('gets all answers by question ID', () => {
        return request.get(`/answers/all?question=${question._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body[0].content, answer2.content);
                assert.deepEqual(body[1].content, answer1.content);
            });
    });

    it('gets an answer by id', () => {
        return request.get(`/answers/${answer2._id}`)
            .then(({ body }) => {
                assert.deepEqual(body._id, answer2._id);
            });
    });

    it('deletes an answer', () => {
        return request.delete(`/answers/${answer2._id}`)
            .set('Token', token)
            .set('Authorization', 'admin')
            .then(() => {
                return Answer.findById(answer2._id);
            })
            .then(found => {
                assert.isNull(found);
            });
    });

    it('returns 404 on get of non-existent id', () => {
        return request.get(`/answers/${answer2._id}`)
            .then(response => {
                assert.equal(response.status, 404);
                assert.match(response.body.error, new RegExp(answer2._id));
            });
    });
});