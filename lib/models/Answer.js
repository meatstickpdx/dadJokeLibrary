const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');

const schema = new Schema({

    content: RequiredString,
    author: { type: Schema.Types.ObjectId, ref: 'User', default: 'req.user._id' },
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true}

});
module.exports = mongoose.model('Answer', schema);