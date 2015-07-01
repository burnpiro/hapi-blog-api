var UsersController = require('./files.controller');

module.exports = [
    {   method: 'POST',   path: '/files',   config: UsersController.upload },
    {   method: 'GET',   path: '/files/{fileName}',   config: UsersController.getOne },
    {   method: 'GET',   path: '/files',   config: UsersController.getAll }
];
