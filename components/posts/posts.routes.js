var PostsController = require('./posts.controller');

module.exports = [
    {   method: 'GET',   path: '/posts',   config: PostsController.getAll },
    {   method: 'POST',   path: '/posts',   config: PostsController.create }
];
