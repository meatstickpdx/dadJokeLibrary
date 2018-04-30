const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema ({

    username: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user']},
    hash: String
});

module.exports = mongoose.model('User', schema);