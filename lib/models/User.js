const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const schema = new Schema ({

    username: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user'},
    hash: String
});

schema.methods = {
    generateHash(password) {
        this.hash = bcrypt.hashSync(password, 8);
    },
    comparePassword(password) {
        return bcrypt.compareSync(password, this.hash);
    },
    signup(credentials) {
        return $.post(`${MONGODB_URI}/auth/signup`, credentials)
            .then(res => {
                this.current = true;
                localStorage.token = res.token;
                page.redirect('/');
            });
    }
};

module.exports = mongoose.model('User', schema);