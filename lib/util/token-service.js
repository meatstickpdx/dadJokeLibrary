require('dotenv').config();
const jwt = require('jsonwebtoken');
const APP_SECRET = process.env.APP_SECRET;

module.exports = {
    sign(user) {
        const payload = {
            id: user._id,
            role: user.role
        };

        return jwt.sign(payload, APP_SECRET);
    },

    verify(token) {
        return jwt.verify(token, APP_SECRET);
    }
};