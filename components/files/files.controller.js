var Joi = require('joi');
var _ = require('lodash');
var Boom = require('boom');
var moment = require('moment');
var config = require('../../config');
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
    auth: false,
    handler: function(request,reply){
        var form = new multiparty.Form();
        //console.log(_.keys(request), request);
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
        var newPath = slug(moment().format('YYYY-MM-DD')+files.file[0].originalFilename);
        fs.writeFile(config.MixInsideFolder + newPath, data, function(err) {
            if (err) {
                return reply(err);
            } else {
                im.resize({
                    srcPath: config.MixInsideFolder + newPath,
                    dstPath: config.MixInsideFolder + '1920px' +newPath,
                    width:   1920
                }, function(err){
                    if (err) {
                        console.log('Cannot resize image');
                    }
                });
                im.resize({
                    srcPath: config.MixInsideFolder + newPath,
                    dstPath: config.MixInsideFolder + '1024px' +newPath,
                    width:   1024
                }, function(err){
                    if (err) {
                        console.log('Cannot resize image');
                    }
                });
                im.resize({
                    srcPath: config.MixInsideFolder + newPath,
                    dstPath: config.MixInsideFolder + '400px' +newPath,
                    width:   400
                }, function(err){
                    if (err) {
                        console.log('Cannot resize image');
                    }
                });
                im.resize({
                    srcPath: config.MixInsideFolder + newPath,
                    dstPath: config.MixInsideFolder + '160px' +newPath,
                    width:   160
                }, function(err){
                    if (err) {
                        console.log('Cannot resize image');
                    }
                });
                return reply({code: 200, message: 'File uploaded successfully',
                        uploaded: 1,
                        url: 'http://'+config.server.host+':'+config.server.port + config.filesUrlPath + '1024px' + slug(moment().format('YYYY-MM-DD')+files.file[0].originalFilename),
                        fileName: slug(moment().format('YYYY-MM-DD')+files.file[0].originalFilename)
                    });
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
        if(!_.isUndefined(request.params.size)) {
            var size = request.params.size;
        }
        var file = request.params.fileName,
            ext = getExtension(file);

        var path = config.publicFolder + config.uploadFolder + "/" +file;
        if(!_.isUndefined(size)) {
            path = config.publicFolder + config.uploadFolder + "/" + size + 'px' +file;
        }
        console.log(path);
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
            if(isImage(stat.name) && hasResolution(stat.name, size)) {
                files.push(size+'px'+stat.name);
            }
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

function getExtension(input)
{
    var re = /(?:\.([^.]+))?$/;
    return re.exec(input)[1];
}

function isImage(input)
{
    var extensions = ['jpg', 'jpeg', 'gif', 'png'];
    return _.includes(extensions, getExtension(input));
}

function hasResolution(input, resolution)
{
    return input.split('px')[0] === resolution;
}