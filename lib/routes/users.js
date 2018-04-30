const router = require('express').Router(); // eslint-disable-line

module.exports = router
    .get('/', (req, res, next) => {
        console.log('Just getting users in there');
    });