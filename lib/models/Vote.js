const mongoose = require('mongoose');
const { Schema } = mongoose;

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
module.exports = mongoose.model('Votes', schema);