const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');
const { countByAnswer } = require('./aggregations');

const schema = new Schema({

    emoji: {
        ...RequiredString,
        enum: ['💖', '😂', '🤦']
    },
    voter: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    answer: {
        type: Schema.Types.ObjectId,
        ref: 'Answer',
        required: true
    }
});

schema.statics = {
    // no need to repeat "Vote"
    check(question, voter, emoji) {
        // this is just a find, no need for aggregate...
        // return this.aggregate(byEmoji(questionId, voterId, emoji));
        // use "exists" :)
        return this.exists({ question, voter, emoji });
    },
    // "tally" (and "tallyVote") sound like data is being saved.
    getTally(questionId) {
        return this.aggregate(countByAnswer(questionId));
    }
};

module.exports = mongoose.model('Vote', schema);