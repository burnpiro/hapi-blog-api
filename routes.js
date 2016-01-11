var mainRoutes = require('./components/main/main.routes');
var categoriesRoutes = require('./components/categories/categories.routes');
var postsRoutes = require('./components/posts/posts.routes');
var usersRoutes = require('./components/users/users.routes');
var filesRoutes = require('./components/files/files.routes');
var messagesRoutes = require('./components/messages/messages.routes');
var tagsRoutes = require('./components/tags/tags.routes');

module.exports = [].concat(mainRoutes, categoriesRoutes, postsRoutes, usersRoutes, filesRoutes, messagesRoutes, tagsRoutes);