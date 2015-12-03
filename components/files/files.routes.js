var FilesController = require('./files.controller');

module.exports = [
    {   method: 'POST',   path: '/files',   config: FilesController.upload },
    {   method: 'GET',   path: '/files/{fileName}',   config: FilesController.getOne },
    {   method: 'GET',   path: '/images/{fileName}/{size}',   config: FilesController.getOneWithSize },
    {   method: 'POST',   path: '/images',   config: FilesController.getAllImages }
];
