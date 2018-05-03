const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');


describe( 'Question E2E API', () => {

    before(() => dropCollection('questions'));
    before(() => dropCollection('users'));

    let token = '';

    const punchline = {
        content: 'It got mugged'
    };

    const joe = {
        username: 'Joe',
        password: 'abc',
        role: 'admin'
    };

    let dadJoke = {
        prompt: 'This is a dad question',
        status: 'submit'
    };

    let dadBod = {
        prompt: '{ dadBod }',
        status: 'vote'
    };

    before(() => {
        return request.post('/auth/signup')
            .send(joe)
            .then(({ body }) => {
                dadJoke.user = body._id;
                dadBod.user = body._id;
                token = body.token;
            });
    });
    
    before(() => {
        return request.post('/questions')
            .set('Token', token)
            .send(dadBod)
            .then(({ body }) => {
                punchline.question = body._id;
                dadBod = body;
            });
    });

    it('posts a question', () => {
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

    const getFields = ({ _id, prompt, status }) => ({ _id, prompt, status });

    it('gets all questions', () => {
        return request.get('/questions')
            .set('Token', token)
            .then(({ body }) => {
                assert.deepEqual(body, [dadBod, dadJoke].map(getFields));
            });
    });

    it('gets the vote with status "vote"', () => {
        return request.get('/questions/voting')
            .set('Token', token)
            .then(({ body }) => {
                assert.deepEqual(body.prompt, dadBod.prompt);
            });
    });

    it('get questions by id', () => {
        return request.get(`/questions/${dadBod._id}`)
            .set('Token', token)
            .then(({ body }) => {
                assert.deepEqual(body, getFields(dadBod));
            });
    });

    it('updates all questions status to submit', () => {
        return request.put(`/questions`)
            .set('Token', token)
            .send(dadBod)
            .then(() => {
                return request.get('/questions')
                    .set('Token', token)
                    .then(( { body }) => {
                        assert.deepEqual(body[0].status, 'submit');
                        assert.deepEqual(body[1].status, 'submit');
                    });
            });
    });

    it('put questions by id', () => {
        return request.put(`/questions/${dadBod._id}`)
            .set('Token', token)
            .send(dadBod)
            .then(() => {
                return request.get(`/questions/${dadBod._id}`)
                    .set('Token', token)
                    .then(({ body }) => {
                        assert.deepEqual(body.status, 'vote');
                    });
            });
    });

    it('delete questions by id', () => {
        return request.delete(`/questions/${dadBod._id}`)
            .set('Token', token)
            .then(() => {
                return request.get(`/questions/${dadBod._id}`)
                    .set('Token', token);
            })
            .then(res => {
                assert.strictEqual(res.status, 404);
            });
    });
});