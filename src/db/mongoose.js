var mongoose = require('mongoose');

// Check mongodb connections
mongoose.connection.on('open', function (ref) {
        console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function (err) {
        console.log('Could not connect to mongo server');
        console.log(err);
});
var db = mongoose.connect('mongodb://localhost:27017/kittysquad');

module.exports = mongoose;
