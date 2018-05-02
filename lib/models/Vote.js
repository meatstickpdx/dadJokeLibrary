const mongoose = require('mongoose');
const { Schema } = mongoose;
const { byEmoji } = require('./aggregations');

const schema = new Schema({

    emoji: {
        type: String,
        required: true,
        enum: ['💖', '😂', '🤦']
    },
    voter: { type: Schema.Types.ObjectId, ref: 'User', required: true, default: 'req.user._id'},
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true},
    answer: { type: Schema.Types.ObjectId, ref: 'Answer', required: true}

});

schema.statics = {
    checkVote(questionId, voterId, emoji) {
        return this.aggregate(byEmoji(questionId, voterId, emoji));
    }
};

module.exports = mongoose.model('Votes', schema);