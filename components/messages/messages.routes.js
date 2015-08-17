var MessagesController = require('./messages.controller');

module.exports = [
    {   method: 'GET',   path: '/messages',   config: MessagesController.getAll },
    {   method: 'POST',  path: '/messages',   config: MessagesController.create },
    {   method: 'DELETE',   path: '/messages/{messageId}',   config: MessagesController.remove }
];
