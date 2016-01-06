var Joi = require('joi');
var _ = require('lodash');
var Boom = require('boom');
var Gallery = require('./gallery.model');
var File = require('../files/file.model');

module.exports.create = {
    validate: {
        payload: {
            name: Joi.string().required(),
            author: Joi.string().required()
        }
    },
    auth: {
        strategy: 'token',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        var gallery = new Gallery(request.payload);
        gallery.save(function(error, gallery) {
            if(!error) {
                reply({code: 200, message: 'Gallery created successfully', data: gallery});
            } else {
                reply(Boom.forbidden('Cannot create gallery'));
            }
        });
    }
};

module.exports.addImage = {
    validate: {
        payload: {
            name: Joi.string().required(),
            description: Joi.string(),
            path: Joi.string().required()
        }
    },
    auth: {
        strategy: 'token',
        scope: ['user', 'admin']
    },
    handler: function(request, reply) {
        Gallery.findOne({
            _id: request.params.galleryId
        }, function(error, gallery) {
            if(error) {
                reply(Boom.badImplementation('Unknown error has appeared'));
            }
            if(_.isNull(gallery)) {
                reply(Boom.notFound('Cannot find gallery with that ID'));
            }
            var image = new File(request.payload);
            image.save(function(error, image) {
                if(!error) {
                    gallery.images.push(image);
                    gallery.save(function(error) {
                        if(!error) {
                            reply({code: 200, message: 'Gallery created successfully', data: gallery});
                        } else {
                            reply(Boom.forbidden('Cannot add image to gallery'));
                        }
                    });
                } else {
                    reply(Boom.forbidden('Cannot create image'));
                }
            });
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