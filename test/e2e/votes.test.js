const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.only('Vote E2E API', () => {

    let token = null;

    const user = {
        username: 'Mr. Jones',
        password: 'abc',
        role: 'admin'
    };

    const answer = {
        content: 'To get to the other side',
    };

    const question = {
        prompt: 'Why did the chicken?',
    };

    let vote1 = {
        emoji: '💖'
    };

    let vote2 = {
        emoji: '🤦'
    };

    before(() => dropCollection('users'));
    before(() => dropCollection('votes'));
    before(() => dropCollection('answers'));
    before(() => dropCollection('questions'));

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    const getAllFields = ({ _id, answer, emoji, question}) => {
        return {
            _id, answer, emoji, question
        };
    };

    const getQFields = ({ _id, answer, emoji }) => {
        return {
            _id, answer, emoji
        };
    };

    before(() => {
        return request.post('/auth/signup')
            .send(user)
            .then(checkOk)
            .then(( { body }) => {
                user._id = body._id;
                assert.ok(user._id);

                token = body.token;

                vote1.voter = user._id;
                vote2.voter = user._id;
                question.user = user._id;
            });
    });

    before(() => {
        return request.post('/questions')
            .set('Authorization', 'admin')
            .set('Token', token)
            .send(question)
            .then(checkOk)
            .then(({ body }) => {
                question._id = body._id;
                assert.ok(question._id);

                vote1.question = question._id;
                vote2.question = question._id;
                answer.question = question._id;
            });
    });

    before(() => {
        return request.post('/answers')
            .set('Authorization', 'admin')
            .set('Token', token)
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
            .set('Token', token)
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

    it('cannot post a vote twice', () => {
        return request.post('/votes')
            .set('Token', token)
            .send(vote1)
            .then(checkOk)
            .then( ({ text }) => {
                assert.equal(text, '"Cannot vote twice"');
            });
    });

    it('gets all votes', () => {
        return request.post('/votes')
            .set('Authorization', 'admin')
            .set('Token', token)
            .send(vote2)
            .then(checkOk)
            .then(({ body }) => {
                vote2 = body;
                assert.ok(vote2._id);
                return request.get(`/votes`)
                    .set('Authorization', 'admin')
                    .set('Token', token)
                    .then(checkOk)
                    .then(({ body }) => {
                        assert.deepEqual(body, [vote1, vote2].map(getAllFields));
                    });
            });
    });

    it('gets all votes by question', () => {
        return request.get(`/votes?question=${question._id}`)
            .set('Authorization', 'admin')
            .set('Token', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [vote1, vote2].map(getQFields));
            });
    });

    it('updates a vote', () => {
        vote2.emoji = '😂';

        return request.put(`/votes/${vote2._id}`)
            .set('Authorization', 'admin')
            .set('Token', token)
            .send(vote2)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, vote2);
            });
    });
});