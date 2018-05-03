const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    prompt: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['submit', 'vote', 'result'],
        default: ['submit']
    }
});

module.exports = mongoose.model('Question', schema);