var _ = require('lodash');
var moment = require('moment');
var config = require('../../config');
var fs = require('fs'),
    walk = require('walk'),
    multiparty = require('multiparty'),
    im = require('imagemagick');


var fileService = {

};
/*
 * upload file function
 */

fileService.upload = function(files, reply) {
    fs.readFile(files.file[0].path, function(err, data) {
        fileService.checkFileExist();
        var newPath = fileService.slug(moment().format('YYYY-MM-DD')+files.file[0].originalFilename);
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
                    data: {
                        path: config.MixInsideFolder + fileService.slug(moment().format('YYYY-MM-DD')+files.file[0].originalFilename),
                        name: fileService.slug(moment().format('YYYY-MM-DD')+files.file[0].originalFilename)
                    }});
            }
        });
    });
};

/*
 * Check File existence and create if not exist
 */

fileService.checkFileExist = function() {
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

fileService.slug = function(input)
{
    return input
        .replace(/^\s\s*/, '') // Trim start
        .replace(/\s\s*$/, '') // Trim end
        .toLowerCase() // Camel case is bad
        .replace(/[^a-z0-9._\-~!\+\s]+/g, '') // Exchange invalid chars
        .replace(/[\s]+/g, '-'); // Swap whitespace for single hyphen
};

fileService.getExtension = function(input)
{
    var re = /(?:\.([^.]+))?$/;
    return re.exec(input)[1];
};

fileService.isImage = function(input)
{
    var extensions = ['jpg', 'jpeg', 'gif', 'png'];
    return _.includes(extensions, fileService.getExtension(input));
};

fileService.hasResolution = function(input, resolution)
{
    return input.split('px')[0] === resolution;
};

module.exports.hasResolution = fileService.hasResolution;
module.exports.isImage = fileService.isImage;
module.exports.upload = fileService.upload;
module.exports.getExtension = fileService.getExtension;