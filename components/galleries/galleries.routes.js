var GalleriesController = require('./galleries.controller');

module.exports = [
    {   method: 'GET',   path: '/galleries',   config: GalleriesController.getAll },
    {   method: 'POST',   path: '/galleries',   config: GalleriesController.create },
    {   method: 'POST',   path: '/galleries/search',   config: GalleriesController.search },
    {   method: 'DELETE',   path: '/galleries/{postId}',   config: GalleriesController.delete }
];