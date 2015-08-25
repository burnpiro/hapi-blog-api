var Joi = require('joi');
var _ = require('lodash');
var Boom = require('boom');
var moment = require('moment');
var config = require('../../config');
var FileService = require('../services/file.service');
var fs = require('fs'),
    walk = require('walk'),
    multiparty = require('multiparty'),
    im = require('imagemagick');

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
                FileService.upload(files, reply);
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
        if(!_.isUndefined(request.params.size)) {
            var size = request.params.size;
        }
        var file = request.params.fileName,
            ext = FileService.getExtension(file);

        var path = config.publicFolder + config.uploadFolder + "/" +file;
        if(!_.isUndefined(size)) {
            path = config.publicFolder + config.uploadFolder + "/" + size + 'px' +file;
        }
        fs.readFile(path, function(error, content) {
            if (error) {
                return reply("file not found");
            }
            var contentType;
            switch (ext) {
                case "pdf":
                    contentType = 'application/pdf';
                    break;
                case "ppt":
                    contentType = 'application/vnd.ms-powerpoint';
                    break;
                case "pptx":
                    contentType = 'application/vnd.openxmlformats-officedocument.preplyentationml.preplyentation';
                    break;
                case "xls":
                    contentType = 'application/vnd.ms-excel';
                    break;
                case "xlsx":
                    contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    break;
                case "doc":
                    contentType = 'application/msword';
                    break;
                case "docx":
                    contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                    break;
                case "csv":
                    contentType = 'application/octet-stream';
                    break;
                case "png":
                    contentType = 'image/png';
                    break;
                case "gif":
                    contentType = 'image/gif';
                    break;
                case "jpg":
                    contentType = 'image/jpeg';
                    break;
                case "jpeg":
                    contentType = 'image/jpeg';
                    break;
                default:
                    contentType = '';
                    break;
            }

            reply(content).header('Content-Type', contentType).header("Content-Disposition", "attachment; filename=" + file);

        });
    }
};

/**
 *get fileList
 */

module.exports.getAllImages = {
    auth: false,
    handler: function(request, reply) {
        var size = request.params.size;
        var files = [];
        // Walker options
        var walker = walk.walk(config.publicFolder + config.uploadFolder, {
            followLinks: false
        });

        walker.on('file', function(root, stat, next) {
            // Add this file to the list of files
            if(FileService.isImage(stat.name) && FileService.hasResolution(stat.name, size)) {
                files.push(stat.name.split('px').pop() );
            }
            next();
        });

        walker.on('end', function() {
            return reply({data: files, code: 200});
        });
    }
};