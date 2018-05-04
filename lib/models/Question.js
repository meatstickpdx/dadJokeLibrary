const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');

const schema = new Schema({
    
    prompt: RequiredString,
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