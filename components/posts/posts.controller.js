var Joi = require('joi');
var _ = require('lodash');
var Boom = require('boom');
var Category = require('../categories/category.model');
var Post = require('./post.model');

module.exports.getAll = {
    handler: function(request, reply) {
        Post.find({}, function(error, posts) {
            if(!error) {
                if(_.isNull(posts)) {
                    reply(Boom.notFound('There is no posts added yet'));
                }
                reply(posts);
            } else {
                reply(Boom.badImplementation(error));
            }
        });
    }
};

module.exports.create = {
    validate: {
        payload: {
            _category: Joi.string().required(),
            name: Joi.string().required(),
            content: Joi.string()
        }
    },
    handler: function(request, reply) {
        Category.findOne({
            _id: request.payload._category
        }, function(error, category) {
            if(error || _.isNull(category)) {
                reply(Boom.notFound('Cannot find category'));
            } else {
                var post = new Post(request.payload);
                post.save(function (error, category) {
                    if (!error) {
                        reply(post).created('/posts/' + post._id);
                    } else {
                        if (11000 === error.code || 11001 === error.code) {
                            reply(Boom.forbidden('category id already taken'));
                        } else {
                            reply(Boom.forbidden(getErrorMessageFrom(error)));
                        }
                    }
                });
            }
        });
    }
};