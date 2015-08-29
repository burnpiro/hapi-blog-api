var PostsController = require('./posts.controller');

module.exports = [
    {   method: 'GET',   path: '/posts',   config: PostsController.getAll },
    {   method: 'POST',   path: '/posts',   config: PostsController.create },
    {   method: 'POST',   path: '/posts/search',   config: PostsController.search },
    {   method: 'GET',   path: '/posts/{postId}',   config: PostsController.getOne },
    {   method: 'PUT',   path: '/posts/{postId}',   config: PostsController.update },
    {   method: 'DELETE',   path: '/posts/{postId}',   config: PostsController.delete }
];