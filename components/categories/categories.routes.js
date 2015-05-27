var CategoriesController = require('./categories.controller');

module.exports = [
    {   method: 'GET',   path: '/categories',   config: CategoriesController.getAll },
    {   method: 'POST',  path: '/categories',   config: CategoriesController.create },
    {   method: 'GET',   path: '/categories/{categoryId}',   config: CategoriesController.getOne }
];
