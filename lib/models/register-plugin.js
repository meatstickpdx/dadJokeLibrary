const mongoose = require('mongoose');

const exists = schema => {
    schema.static('exists', function(query){
        return this.find(query)
            .count()
            .then(count => count > 0);
    });
};

mongoose.plugin(exists);