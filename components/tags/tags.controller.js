var Joi = require('joi');
var _ = require('lodash');
var Boom = require('boom');
var Tag = require('../tags/tag.model');

module.exports.getAll = {
    auth: {
        strategy: 'token',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        Tag.find({}, 'name', function(error, tags) {
            if(!error) {
                if(_.isNull(tags)) {
                    reply(Boom.notFound('There is no tags added yet'));
                }
                reply({
                    code: 200,
                    data: tags
                });
            } else {
                reply(Boom.badImplementation(error));
            }
        });
    }
};

module.exports.create = {
    validate: {
        payload: {
            name: Joi.string().required()
        }
    },
    auth: {
        strategy: 'token',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        var tag = new Tag(request.payload);
        tag.save(function(error, tag) {
            if(!error) {
                reply({message: 'Tag created successfully', data: tag});
            } else {
                if(11000 === error.code || 11001 === error.code) {
                    reply(Boom.forbidden('tag id already taken'));
                } else {
                    reply(Boom.forbidden(error));
                }
            }
        });
    }
};

module.exports.search = {
    validate: {
        payload: {
            _id: Joi.string(),
            name: Joi.string()
        }
    },
    auth: {
        strategy: 'token',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        if(!_.isUndefined(request.payload.name)) {
            request.payload.name = new RegExp(''+request.payload.name+'', "i");
        }
        Tag.find(request.payload, 'name', function(error, tags) {
            if(!error) {
                if(_.isNull(tags)) {
                    reply(Boom.notFound('There is no tags added yet'));
                } else {
                    reply({
                        code: 200,
                        data: tags
                    });
                }
            } else {
                reply(Boom.badImplementation(error));
            }
        });
    }
};