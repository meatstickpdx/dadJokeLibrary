const { assert } = require('chai');
//const request = require('./request');
//const { dropCollection } = require('./db');
const Question = require('../../lib/models/Question');
//const { Types } = require('mongoose');

describe.only( 'Question API', () => {

    const dadJoke = {
        prompt: 'This is a dad question',
        answers: ['dads are the best jokesters', 'dads tell horrible jokes'],
        user: 75,
        status: 'submit'
    };
    it('saves a question', () => {
        return new Question(dadJoke).save()
            .then(saved => {
                saved = saved.toJSON();
                const { _id, __v } = saved;
                assert.ok(_id);
                assert.equal( __v, 0);
            });

    });
});