var Hapi = require('hapi');
var routes = require('./routes');
var config = require('./config');
var db = require('./database');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var UsersController = require('./components/users/users.controller');
var _ = require('lodash');

var server = new Hapi.Server();

server.connection(
    {
        port: config.server.port,
        host: config.server.host,
        routes: {
            cors: true
        }
    }
);

server.register([require('hapi-auth-jwt'), require('inert')], function(error) {

    server.auth.strategy('token', 'jwt', {
        key: config.token.privateKey,
        validateFunc: UsersController.validateToken
    });
    server.route(routes);
});

server.start(function() {
    console.log('Server running on port: ', server.info.uri)
});