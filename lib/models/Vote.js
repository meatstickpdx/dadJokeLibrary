const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');
const { voteByEmoji, countByAnswer } = require('./aggregations');

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
    
    checkVote(questionId, voterId, emoji) {
        return this.aggregate(voteByEmoji(questionId, voterId, emoji));
    },
    tallyVote(questionId) {
        return this.aggregate(countByAnswer(questionId));
    }
};

module.exports = mongoose.model('Vote', schema);