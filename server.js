var Hapi = require('hapi');
var routes = require('./routes');
var config = require('./config');
var Db = require('./database');

var server = new Hapi.Server();

server.connection({port: config.server.port, host: config.server.host});

server.route(routes);

server.start(function() {
    console.log('Server running on port: ', server.info.uri)
});