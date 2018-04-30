require('dotenv').config({ path: './.env'});
const connect = require('../../lib/util/dbconnect');
const mongoose = require('mongoose');

before(() => connect(process.env.MONGODB_URI || 'mongodb://localhost:27019/meatstick_test'));
after(() => mongoose.connection.close());

module.exports = {
    dropCollection(name) {
        return mongoose.Collection.dropCollection(name)
            .catch(err => {
                if(err.codeName !== 'NamespaceNotFound') throw err;
            });
    }
};