var UsersController = require('./users.controller');

module.exports = [
    {   method: 'POST',   path: '/users',   config: UsersController.create },
    {   method: 'GET',   path: '/users/{userName}',   config: UsersController.getOne }
];
