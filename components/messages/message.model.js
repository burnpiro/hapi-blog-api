var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;

var messageSchema = new Schema({
    title          : { type: String, required: true, trim: true },
    email          : { type: String, required: true, trim: true },
    author        : { type: String, required: true, trim: true },
    content       : { type: String, required: true },
    createdAt     : { type: Date, default: Date.now }
});

var message = mongoose.model('Message', messageSchema);

module.exports = exports = message;