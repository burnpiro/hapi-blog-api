var Joi = require('joi');
var _ = require('lodash');
var Boom = require('boom');
var Gallery = require('./gallery.model');
var Image = require('./image.model');

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
            var image = new Image(request.payload);
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