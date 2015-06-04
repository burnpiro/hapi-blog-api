var Joi = require('joi');
var Boom = require('boom');
var config = require('../../config');
var Jwt = require('jsonwebtoken');
var User = require('./user.model');
var _ = require('lodash');

module.exports.create = {
    validate: {
        payload: {
            userName: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    handler: function(request, reply) {
        request.payload.scope = 'user';
        var user = new User(request.payload);
        user.save(request.payload, function(error, user) {
            if(!error) {
                reply('User created successfully, userId: '+user._id);
            } else {
                if (11000 === error.code || 11001 === error.code) {
                    reply(Boom.badRequest("User with this email already exists"));
                } else {
                    reply(Boom.badImplementation('Cannot create User'));
                }
            }
        });
    }
};

module.exports.getOne = {
    handler: function(request, reply) {
        User.findOne({
            userName: request.params.userName
        }, function(error, user) {
            if(!error) {
                if(_.isNull(user)) {
                    reply(Boom.notFound('Cannot find user with that userName'));
                }
                reply(user);
            } else {
                reply(Boom.notFound('Cannot find user with that userName'));
            }
        })
    }
};