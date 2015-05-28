var Mongoose   = require('mongoose');
var Schema     = Mongoose.Schema;
var Category   = require('../categories/category.model');

var postSchema = new Schema({
    _category     : { type: String, required: true, trim: true, ref: 'Category' },
    name          : { type: String, required: true, trim: true },
    content       : { type: String }
});

var post = Mongoose.model('post', postSchema);

module.exports = exports = post;