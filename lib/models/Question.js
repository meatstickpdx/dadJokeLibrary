const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    prompt: {
        type: String,
        required: true
    },
    answers: [{
        type: Schema.Types.ObjectId,
        ref: 'Answer'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: 'req.user._id'
    },
    status: {
        type: String,
        enum: ['submit', 'vote', 'result']
    }
});

module.exports = mongoose.model('Question', schema);