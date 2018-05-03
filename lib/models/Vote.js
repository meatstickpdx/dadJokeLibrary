const mongoose = require('mongoose');
const { Schema } = mongoose;
const { byEmoji, countByAnswer } = require('./aggregations');

const schema = new Schema({

    emoji: {
        type: String,
        required: true,
        enum: ['💖', '😂', '🤦']
    },
    voter: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true},
    answer: { type: Schema.Types.ObjectId, ref: 'Answer', required: true}

});

schema.statics = {
    checkVote(questionId, voterId, emoji) {
        return this.aggregate(byEmoji(questionId, voterId, emoji));
    },
    tallyVote(questionId) {
        return this.aggregate(countByAnswer(questionId));
    }

};

module.exports = mongoose.model('Vote', schema);