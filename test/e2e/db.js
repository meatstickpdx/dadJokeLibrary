require('dotenv').config({ path: './.env'});
const connect = require('../../lib/util/connect');
const mongoose = require('mongoose');

before(() => connect(process.env.MONGODB_URI));
after(() => mongoose.connection.close());

module.exports = {
    dropCollection(name) {
        return mongoose.connection.dropCollection(name)
            .catch(err => {
                if(err.codeName !== 'NamespaceNotFound') throw err;
            });
    }
};