require('dotenv').config();
const http = require('http');
const app = require('./lib/app');
const connect = require('./lib/util/connect');

const PORT = process.env.PORT;

const MONGODB_URI = process.env.MONGODB_URI;

connect(MONGODB_URI);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`server listening on port`, server.address().port);
});