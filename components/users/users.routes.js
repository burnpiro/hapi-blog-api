var UsersController = require('./users.controller');

module.exports = [
    {   method: 'POST',   path: '/login',   config: UsersController.login },
    {   method: 'POST',   path: '/users',   config: UsersController.create },
    {   method: 'GET',   path: '/users/{userName}',   config: UsersController.getOne },
    {   method: 'GET',   path: '/users',   config: UsersController.getAll },
    {   method: 'DELETE',   path: '/users/{userName}',   config: UsersController.remove }
];
