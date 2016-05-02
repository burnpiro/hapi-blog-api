var Joi = require('joi');
var _ = require('lodash');
var Boom = require('boom');
var Category = require('../categories/category.model');
var Post = require('./post.model');
var config = require('../../config');
var natural = require('natural');
var slug = require('slug');

module.exports.getAll = {
    auth: {
        strategy: 'token',
        scope: ['user', 'admin']
    },
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
        query.publishedAt = { $lt : Date('now') };
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

module.exports.getRelated = {
    validate: {
        payload: {
            _category: Joi.string(),
            limit: Joi.number(),
            offset: Joi.number(),
            post: Joi.string()
        }
    },
    auth: false,
    handler: function(request, reply) {
        var query = { display: true };
        var limit = !_.isUndefined(request.payload.limit) ? request.payload.limit : 4;
        var relatedPosts = [];
        var TfIdf = natural.TfIdf,
            tfidf = new TfIdf();

        if(!_.isUndefined(request.payload._category)) {
            query._category = request.payload._category;
        }
        query.publishedAt = { $lt : Date('now') };
        query.deletedAt = null;
        query._id = request.payload.post;
        Post.findOne(query, null, function(error, selectedPost) {
                if(!error) {
                    if(_.isNull(selectedPost)) {
                        reply(Boom.notFound('There is no post'));
                    }

                    Post.find({
                            _id: {$ne : selectedPost._id},
                            tags: { $exists: true, $ne: [] },
                            deletedAt: null,
                            display: true,
                            publishedAt: { $lt : Date('now') }
                        }, '_id image name tags',
                        {
                            sort: {createdAt: -1}
                        }, function(error, posts) {
                            if(!error) {
                                if(_.isNull(posts)) {
                                    return reply(Boom.notFound('There is no posts added yet'));
                                }

                                _.forEach(posts, function(post) {
                                    if(!_.isEmpty(post.tags) && post._id !== selectedPost._id) {
                                        tfidf.addDocument(post.tags, post._id);
                                    }
                                });

                                var sort = [];
                                tfidf.tfidfs(selectedPost.tags, function(i, measure) {
                                    sort.push({id:i, weight:measure});
                                });
                                sort = _.orderBy(sort, ['weight', 'id'], ['desc', 'asc']);

                                if(_.isEmpty(sort)) {
                                    return reply({
                                        code: 200,
                                        data: relatedPosts
                                    });
                                }
                                _.forEach(posts, function(post, index) {
                                    if(index < limit) {
                                        relatedPosts.push(posts[sort[index].id]);
                                    }
                                });

                                reply({
                                    code: 200,
                                    data: relatedPosts
                                });
                            } else {
                                reply(Boom.badImplementation(error));
                            }
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
            display: Joi.boolean().default(config.defaultValues.display),
            publishedAt: Joi.string(),
            tags: Joi.array().default([]).items(Joi.string())
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
                request.payload._id = slug(request.payload.name, {lower: true});
                if(!_.isUndefined(request.payload.publishedAt)) {
                    request.payload.publishedAt = new Date(request.payload.publishedAt);
                }
                var post = new Post(request.payload);
                post.save(function (error, category) {
                    if (!error) {
                        console.log(post);
                        reply({message: 'Post created successful', data: post, code: 200});
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
            _id: request.params.postId,
            deletedAt: null
        })
        .populate('_category', '_id name')
        .exec(function(error, post) {
            if(!error) {
                if(_.isNull(post)) {
                    return reply(Boom.notFound('Cannot find post with that ID'));
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

module.exports.getOneById = {
    auth: false,
    handler: function(request, reply) {
        Post.findOne({
            _id: request.params.postId,
            deletedAt: null
        })
            .populate('_category', '_id name')
            .exec(function(error, post) {
                if(!error) {
                    if(_.isNull(post)) {
                        return reply(Boom.notFound('Cannot find post with that ID'));
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
            display: Joi.boolean().default(config.defaultValues.display),
            publishedAt: Joi.string(),
            tags: Joi.array().default([]).items(Joi.string())
        }
    },
    auth: {
        strategy: 'token',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        if(!_.isUndefined(request.payload.publishedAt)) {
            request.payload.publishedAt = new Date(request.payload.publishedAt);
        }
        Post.update({
            _id: request.params.postId, deletedAt: null
        }, request.payload, function(error, post) {
            if (!error) {
                console.log(post);
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