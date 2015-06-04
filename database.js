var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect('mongodb://'+config.database.host+'/'+config.database.db);

var db = mongoose.connection;
db.on('error', function() {
    console.error.bind(console, 'connection error');
});
db.once('open', function callback() {
    console.log('Connection with database succeeded');
});

module.exports.mongoose = mongoose;
module.exports.db = db;