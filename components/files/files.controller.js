var Joi = require('joi');
var _ = require('lodash');
var Boom = require('boom');
var moment = require('moment');
var config = require('../../config');
var fs = require('fs'),
    walk = require('walk'),
    multiparty = require('multiparty');

module.exports.upload = {
    payload: {
        output: 'stream',
        maxBytes: 209715200,
        //allow: 'multipart/form-data',
        parse: false
    },
    auth: false,
    handler: function(request,reply){
        var form = new multiparty.Form();
        form.parse(request.payload, function(err, fields, files) {
            if (err) {
                return reply(err);
            } else {
                upload(files, reply);
            }
        });
    }
};


/*
 * upload file function
 */

var upload = function(files, reply) {
    fs.readFile(files.file[0].path, function(err, data) {
        checkFileExist();
        fs.writeFile(config.MixInsideFolder + slug(moment().format('YYYY-MM-DD')+files.file[0].originalFilename), data, function(err) {
            if (err) {
                return reply(err);
            } else {
                return reply({code: 200, message: 'File uploaded successfully',
                    data: {
                        path: config.MixInsideFolder + slug(moment().format('YYYY-MM-DD')+files.file[0].originalFilename),
                        name: slug(moment().format('YYYY-MM-DD')+files.file[0].originalFilename)
                    }});
            }
        });
    });
};

/*
 * Check File existence and create if not exist
 */

var checkFileExist = function() {
    fs.exists(config.publicFolder, function(exists) {
        if (exists === false) {
            fs.mkdirSync(config.publicFolder);
        }

        fs.exists(config.MixFolder, function(exists) {
            if (exists === false) {
                fs.mkdirSync(config.MixFolder);
            }
        });
    });
};

/**
 * get file
 */

module.exports.getOne = {
    auth: false,
    handler: function(request, reply) {
        var file = request.params.fileName,
            path = config.publicFolder + config.uploadFolder + "/" + file,
            ext = file.substr(file.lastIndexOf('.') + 1);
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

module.exports.getAll = {
    auth: false,
    handler: function(request, reply) {
        var files = [];
        // Walker options
        var walker = walk.walk(config.publicFolder + config.uploadFolder, {
            followLinks: false
        });

        walker.on('file', function(root, stat, next) {
            // Add this file to the list of files
            files.push(stat.name);
            next();
        });

        walker.on('end', function() {
            return reply({data: files, code: 200});
        });
    }
};

function slug(input)
{
    return input
        .replace(/^\s\s*/, '') // Trim start
        .replace(/\s\s*$/, '') // Trim end
        .toLowerCase() // Camel case is bad
        .replace(/[^a-z0-9._\-~!\+\s]+/g, '') // Exchange invalid chars
        .replace(/[\s]+/g, '-'); // Swap whitespace for single hyphen
}