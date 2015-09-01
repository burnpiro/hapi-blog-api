var Joi = require('joi');
var _ = require('lodash');
var Boom = require('boom');
var Category = require('../categories/category.model');
var Post = require('./post.model');
var config = require('../../config');

module.exports.getAll = {
    auth: false,
    handler: function(request, reply) {
        Post.find({deletedAt: null}, null, {sort: {createdAt: -1}},  function(error, posts) {
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


module.exports.search = {
    validate: {
        payload: {
            _category: Joi.string(),
            name: Joi.string(),
            limit: Joi.number(),
            offset: Joi.number()
        }
    },
    auth: false,
    handler: function(request, reply) {
        if(!_.isUndefined(request.payload.name)) {
            request.payload.name = new RegExp(''+request.payload.name+'', "i");
        }
        var query = { display: true };
        if(!_.isUndefined(request.payload._category)) {
            query._category = request.payload._category;
        }
        if(!_.isUndefined(request.payload.name)) {
            query.name = request.payload.name;
        }
        query.deletedAt = null;
        Post.find(query, null,
            {
                skip: !_.isUndefined(request.payload.offset) ? request.payload.offset : 0,
                limit: !_.isUndefined(request.payload.limit) ? request.payload.limit : 12,
                sort: {createdAt: -1}
            }, function(error, posts) {
            if(!error) {
                if(_.isNull(posts)) {
                    reply(Boom.notFound('There is no posts added yet'));
                }
                reply({
                    code: 200,
                    data: posts
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
            _category: Joi.string().required(),
            name: Joi.string().required(),
            author: Joi.string().default(config.defaultValues.author),
            content: Joi.string().required(),
            image: Joi.any(),
            icon: Joi.string(),
            shortText: Joi.string(),
            display: Joi.boolean().default(config.defaultValues.display)
        }
    },
    auth: {
        strategy: 'token',
        scope: ['user', 'admin']
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
                        reply({message: 'Post updated successful', data: post, code: 200});
                    } else {
                        if (11000 === error.code || 11001 === error.code) {
                            reply(Boom.forbidden('category id already taken'));
                        } else {
                            reply(Boom.forbidden(error));
                        }
                    }
                });
            }
        });
    }
};


module.exports.getOne = {
    auth: false,
    handler: function(request, reply) {
        Post.findOne({
            _id: request.params.postId, deletedAt: null
        })
        .populate('_category', '_id name')
        .exec(function(error, post) {
            if(!error) {
                if(_.isNull(post)) {
                    reply(Boom.notFound('Cannot find post with that ID'));
                }
                reply({
                    code: 200,
                    data: post
                });
            } else {
                reply(Boom.notFound('Cannot find post with that ID'));
            }
        });
    }
};

module.exports.update = {
    validate: {
        payload: {
            _category: Joi.string().required(),
            name: Joi.string().required(),
            author: Joi.string().default(config.defaultValues.author),
            content: Joi.string().required(),
            image: Joi.any(),
            icon: Joi.string(),
            shortText: Joi.string(),
            display: Joi.boolean().default(config.defaultValues.display)
        }
    },
    auth: {
        strategy: 'token',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        Post.update({
            _id: request.params.postId, deletedAt: null
        }, request.payload, function(error, post) {
            if (!error) {
                reply({message: 'Post updated successful', data: post, code: 200});
            } else {
                if (11000 === error.code || 11001 === error.code) {
                    reply(Boom.forbidden('Cannot update post'));
                } else {
                    reply(Boom.forbidden(error));
                }
            }
        });
    }
};

module.exports.delete = {
    auth: {
        strategy: 'token',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        Post.update({
            _id: request.params.postId
        }, { deletedAt: Date.now() }, function(error, post) {
            if (!error) {
                reply({message: 'Post deleted successful', code: 200});
            } else {
                if (11000 === error.code || 11001 === error.code) {
                    reply(Boom.forbidden('Cannot delete post'));
                } else {
                    reply(Boom.forbidden(error));
                }
            }
        });
    }
};