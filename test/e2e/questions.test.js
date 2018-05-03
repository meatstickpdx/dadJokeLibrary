const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');


describe( 'Question API', () => {


    before(() => dropCollection('questions'));
    before(() => dropCollection('answers'));
    before(() => dropCollection('users'));

    let token = '';

    let punchline = {
        content: 'It got mugged'
    };

    const joe = {
        username: 'Joe',
        password: 'abc',
    };

    let dadJoke = {
        answers: [],
        prompt: 'This is a dad question',
        status: 'submit'
    };

    let dadBod = {
        prompt: '{ dadBod }',
        status: 'submit'
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

    before(() => {
        return request.post('/answers')
            .set('Token', token)
            .send(punchline)
            .then(({ body }) => {
                dadBod.answers = [body._id];
                punchline = body;
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

    it('updates all questions status to submit', () => {
        return request.put(`/questions`)
            .set('Token', token)
            .set('Authorization', 'admin')
            .send(dadBod)
            .then(({ body }) => {
                assert.equal(body.nModified, 1);
            });
    });

    it('get question and its answers by id', () => {
        const dadBodFields = getFields(dadBod);
        
        return request.get(`/questions/${dadBod._id}/answers`)
            .then(({ body }) => {
                assert.deepEqual(body, {
                    ...dadBodFields,
                    answers: [{
                        content: punchline.content,
                        _id: punchline._id
                    }]
                });
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