const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');

const voteSchema = new Schema ({
    emoji: {
        type: String,
        required: true,
        enum: [':heart:', ':laughing:', ':facepalm:']
    },
    voter: { type: Schema.Types.ObjectId, ref: 'User' }
});

const schema = new Schema({

    content: RequiredString,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    votes: [{voteSchema}]

});

module.exports = mongoose.model('Answer', schema);