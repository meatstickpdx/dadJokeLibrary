const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');
const bcrypt = require('bcryptjs');

const schema = new Schema ({

    username: RequiredString,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    hash: String
});

schema.methods = {
    generateHash(password) {
        this.hash = bcrypt.hashSync(password, 8);
    },
    comparePassword(password) {
        return bcrypt.compareSync(password, this.hash);
    }
};

module.exports = mongoose.model('User', schema);