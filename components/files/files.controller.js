var Joi = require('joi');
var _ = require('lodash');
var Boom = require('boom');
var config = require('../../config');
var FileService = require('../services/file.service');
var Image = require('../galleries/image.model');
var multiparty = require('multiparty');

module.exports.upload = {
    payload: {
        output: 'stream',
        maxBytes: 209715200,
        //allow: 'multipart/form-data',
        parse: false
    },
    auth: {
        strategy: 'token',
        scope: ['user', 'admin']
    },
    handler: function(request,reply){
        var form = new multiparty.Form();
        form.parse(request.payload, function(err, fields, files) {
            if (err) {
                return reply(err);
            } else {
                FileService.upload(files, function(responseImage) {
                    if(FileService.isImage(responseImage.fileName)) {
                        var image = new Image({
                            name: responseImage.fileName,
                            path: config.publicFolder + config.uploadFolder + "/" +responseImage.fileName
                        });
                        image.save(function(error, image) {
                            if(!error) {
                                reply({code: 200, message: 'Image uploaded successfully',
                                    uploaded: 1,
                                    url: 'http://'+config.server.host+':'+config.server.port + config.filesUrlPath + '1024px' + responseImage.fileName,
                                    fileName: responseImage.fileName
                                });
                            } else {
                                reply(Boom.badImplementation('Cannot save image'));
                            }
                        });
                    } else {
                        reply({code: 200, message: 'File uploaded successfully',
                            uploaded: 1,
                            url: 'http://'+config.server.host+':'+config.server.port + config.filesUrlPath + '1024px' + responseImage.fileName,
                            fileName: responseImage.fileName
                        });
                    }
                });
            }
        });
    }
};

/**
 * get file
 */

module.exports.getOne = {
    auth: false,
    handler: function(request, reply) {
        var file = request.params.fileName;

        var path = config.publicFolder + config.uploadFolder + "/" +file;

        FileService.getFile(path, function(contentResponse) {
            if(_.isString(contentResponse)) {
                return reply(contentResponse);
            } else {
                return reply(contentResponse.content).header('Content-Type', contentResponse.contentType).header("Content-Disposition", "attachment; filename=" + file)
            }
        });
    }
};

/**
 * get file
 */

module.exports.getOneWithSize = {
    auth: false,
    handler: function(request, reply) {
        if(!_.isUndefined(request.params.size)) {
            var size = request.params.size;
        }
        var file = request.params.fileName;

        var path = config.publicFolder + config.uploadFolder + "/" +file;
        if(!_.isUndefined(size)) {
            path = config.publicFolder + config.uploadFolder + "/" + size + 'px' +file;
        }
        FileService.getFile(path, function(contentResponse) {
            if(_.isString(contentResponse)) {
                return reply(contentResponse);
            } else {
                return reply(contentResponse.content).header('Content-Type', contentResponse.contentType).header("Content-Disposition", "attachment; filename=" + file)
            }
        });
    }
};

/**
 *get images list
 */

module.exports.getAllImages = {
    validate: {
        payload: {
            limit: Joi.number(),
            offset: Joi.number()
        }
    },
    auth: false,
    handler: function(request, reply) {
        var query = { };
        Image.find(query, 'name',
            {
                skip: !_.isUndefined(request.payload.offset) ? request.payload.offset : 0,
                limit: !_.isUndefined(request.payload.limit) ? request.payload.limit : 12,
                sort: {createdAt: -1}
            }, function(error, images) {
                if(!error) {
                    if(_.isNull(images)) {
                        reply(Boom.notFound('There is no images added yet'));
                    }
                    reply({
                        code: 200,
                        data: images
                    });
                } else {
                    reply(Boom.badImplementation(error));
                }
            });
    }
};