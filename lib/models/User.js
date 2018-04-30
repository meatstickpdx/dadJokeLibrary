const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema ({

    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user']}
});

module.exports = mongoose.model('User', schema);