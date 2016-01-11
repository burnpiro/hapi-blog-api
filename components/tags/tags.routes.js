var TagsController = require('./tags.controller');

module.exports = [
    {   method: 'GET',   path: '/tags',   config: TagsController.getAll },
    {   method: 'POST',   path: '/tags',   config: TagsController.create },
    {   method: 'POST',   path: '/tags/search',   config: TagsController.search }
];