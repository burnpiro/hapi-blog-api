var Hapi = require('hapi');
var routes = require('./routes');
var config = require('./config');
var db = require('./database');
var jwt = require('jsonwebtoken');
var moment = require('moment');

var server = new Hapi.Server();

var validate = function(decodedToken, callback) {
    var error;

    console.log(decodedToken);

    if(decodedToken.userName && decodedToken.iat){
        if(moment().diff(moment(decodedToken.iat*1000), 'seconds') < config.token.tokenExpire) {
            return callback(error, true, decodedToken);
        }
    }

    return callback(error, false, decodedToken);
};

server.connection({port: config.server.port, host: config.server.host});

server.register(require('hapi-auth-jwt'), function(error) {

    server.auth.strategy('token', 'jwt', {
        key: config.token.privateKey,
        validateFunc: validate
    });
    server.route(routes);
});

server.start(function() {
    console.log('Server running on port: ', server.info.uri)
});