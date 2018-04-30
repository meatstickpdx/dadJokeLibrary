const http = require('http');
const app = require('./lib/app');
const connect = require('./lib/util/connect');

const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGOBD_URI || 'mongodb:localhost:27017/dadjoke';

connect(MONGODB_URI);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`server listening on port`, server.address().port);
});